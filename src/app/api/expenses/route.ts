import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const prismaClient = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { amount, category } = await req.json();

    const expense = await prismaClient.expense.create({
      data: {
        amount: parseFloat(amount),
        category,
        omiUserId: session.user.omiUserId,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Create expense error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as { omiUserId: string } | undefined;

    if (!user?.omiUserId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const expenses = await prisma.expense.findMany({
      where: {
        omiUserId: user.omiUserId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 