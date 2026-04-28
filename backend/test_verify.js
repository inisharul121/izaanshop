const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: { variant: true }
        }
      },
      take: 5
    });
    
    console.log(JSON.stringify(orders, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
