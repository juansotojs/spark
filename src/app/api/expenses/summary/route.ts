import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

type ExpenseWithAmount = {
  amount: number;
  category: string;
};

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser | undefined;

    if (!user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get current month's expenses
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const currentMonthExpenses = await prisma.expense.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    });

    // Get previous month's expenses
    const firstDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    const lastMonthExpenses = await prisma.expense.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: firstDayOfLastMonth,
          lte: lastDayOfLastMonth,
        },
      },
    });

    // Calculate totals
    const currentMonthTotal = currentMonthExpenses.reduce((sum: number, expense: ExpenseWithAmount) => sum + expense.amount, 0);
    const lastMonthTotal = lastMonthExpenses.reduce((sum: number, expense: ExpenseWithAmount) => sum + expense.amount, 0);

    // Calculate monthly change
    const monthlyChange = lastMonthTotal === 0 ? 0 : 
      ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

    // Calculate category breakdown
    const categoryBreakdown = currentMonthExpenses.reduce((acc: Record<string, number>, expense: ExpenseWithAmount) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    // Get top categories by amount
    const entries = Object.entries(categoryBreakdown) as [string, number][];
    const topCategories = entries
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category]) => category);

    return NextResponse.json({
      totalSpent: currentMonthTotal,
      categoryBreakdown,
      monthlyChange,
      topCategories,
    });
  } catch (error) {
    console.error('Get expense summary error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 