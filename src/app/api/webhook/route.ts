import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { amount, category, user_id } = await req.json();

    // Validate input
    if (!amount || !category || !user_id) {
      return NextResponse.json(
        { message: 'Amount, category, and user_id are required' },
        { status: 400 }
      );
    }

    // Find user by omiUserId
    const user = await prisma.user.findUnique({
      where: { omiUserId: user_id },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Create expense
    const expense = await prisma.expense.create({
      data: {
        amount,
        category: category as any, // Type assertion needed due to enum
        userId: user.id,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 