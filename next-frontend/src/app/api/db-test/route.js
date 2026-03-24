import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET() {
  try {
    // Attempt to count products as a simple connectivity test
    const productCount = await prisma.product.count();
    const categories = await prisma.category.findMany({ take: 5 });

    return NextResponse.json({
      status: 'success',
      message: 'Direct database connection established!',
      data: {
        totalProducts: productCount,
        recentCategories: categories
      }
    });
  } catch (error) {
    console.error('Database Connection Error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to connect to the database directly.',
      error: error.message
    }, { status: 500 });
  }
}
