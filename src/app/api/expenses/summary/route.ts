import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  omiUserId: string;
}

type ExpenseWithAmount = {
  amount: number;
  category: string;
};

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser | undefined;

    console.log('Session data:', JSON.stringify(session, null, 2));
    console.log('User data:', JSON.stringify(user, null, 2));

    if (!user?.omiUserId) {
      console.log('No omiUserId found in session:', session);
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Fetching expenses for user:', user.omiUserId);

    // First, let's check if there are any expenses at all for this user
    const allUserExpenses = await prisma.expense.findMany({
      where: {
        omiUserId: user.omiUserId,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log('All expenses for user:', JSON.stringify(allUserExpenses, null, 2));

    // Get current month's expenses
    const currentDate = new Date();
    console.log('Current date:', currentDate.toISOString());

    // Set to start of current month (UTC)
    const firstDayOfMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1));
    // Set to end of current month (UTC)
    const lastDayOfMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 0, 23, 59, 59, 999));

    console.log('Date range for current month:', {
      firstDay: firstDayOfMonth.toISOString(),
      lastDay: lastDayOfMonth.toISOString()
    });

    const currentMonthExpenses = await prisma.expense.findMany({
      where: {
        omiUserId: user.omiUserId,
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Current month expenses:', JSON.stringify(currentMonthExpenses, null, 2));

    // Get previous month's expenses
    // Set to start of previous month (UTC)
    const firstDayOfLastMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() - 1, 1));
    // Set to end of previous month (UTC)
    const lastDayOfLastMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 0, 23, 59, 59, 999));

    console.log('Date range for last month:', {
      firstDay: firstDayOfLastMonth.toISOString(),
      lastDay: lastDayOfLastMonth.toISOString()
    });

    const lastMonthExpenses = await prisma.expense.findMany({
      where: {
        omiUserId: user.omiUserId,
        createdAt: {
          gte: firstDayOfLastMonth,
          lte: lastDayOfLastMonth,
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Last month expenses:', JSON.stringify(lastMonthExpenses, null, 2));

    // Calculate totals
    const currentMonthTotal = currentMonthExpenses.reduce((sum: number, expense: ExpenseWithAmount) => sum + expense.amount, 0);
    const lastMonthTotal = lastMonthExpenses.reduce((sum: number, expense: ExpenseWithAmount) => sum + expense.amount, 0);

    console.log('Totals:', {
      currentMonth: currentMonthTotal,
      lastMonth: lastMonthTotal
    });

    // Calculate monthly change
    const monthlyChange = lastMonthTotal === 0 ? 0 :
      ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

    // Calculate category breakdown
    const categoryBreakdown = currentMonthExpenses.reduce((acc: Record<string, number>, expense: ExpenseWithAmount) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    console.log('Category breakdown:', JSON.stringify(categoryBreakdown, null, 2));

    // Get top categories from database
    const dbTopCategories = await prisma.expense.groupBy({
      by: ['category'],
      where: {
        omiUserId: user.omiUserId,
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
      take: 3,
    });

    // Get top category details
    const topCategory = dbTopCategories[0]?.category ?? 'No expenses';
    const topCategoryAmount = dbTopCategories[0]?._sum?.amount ?? 0;

    const response = {
      totalSpent: currentMonthTotal,
      categoryBreakdown,
      monthlyChange: Math.round(monthlyChange),
      topCategories: dbTopCategories.map(cat => ({
        category: cat.category,
        amount: cat._sum?.amount ?? 0,
      })),
      topCategory,
      topCategoryAmount,
    };

    console.log('Sending response:', JSON.stringify(response, null, 2));
    return NextResponse.json(response);
  } catch (error) {
    console.error('Get expense summary error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 