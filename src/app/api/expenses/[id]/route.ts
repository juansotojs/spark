import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as { omiUserId: string } | undefined;

    if (!user?.omiUserId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { amount, category } = await req.json();

    const expense = await prisma.expense.update({
      where: {
        id: params.id,
        omiUserId: user.omiUserId,
      },
      data: {
        amount: parseFloat(amount),
        category,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Update expense error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as { omiUserId: string } | undefined;

    if (!user?.omiUserId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.expense.delete({
      where: {
        id: params.id,
        omiUserId: user.omiUserId,
      },
    });

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 