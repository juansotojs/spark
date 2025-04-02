import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { amount, category, user_id } = await req.json();

    // Validate input
    if (!amount || !category || !user_id) {
      return NextResponse.json(
        { message: 'Amount, category, and user_id are required' },
        { status: 400 }
      );
    }

    // Verify user_id matches session
    if (user_id !== session.user.omiUserId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create expense
    const expense = await prisma.expense.create({
      data: {
        amount,
        category: category as any, // Type assertion needed due to enum
        omiUserId: session.user.omiUserId,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 