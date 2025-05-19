const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123', // In a real app, this would be hashed
        role: 'user',
      },
    });

    console.log('Created test user:', user);

    // Create a test page
    const page = await prisma.page.create({
      data: {
        title: 'Test Page',
        emoji: '📝',
        userId: user.id,
      },
    });

    console.log('Created test page:', page);

    // Create a test log
    const log = await prisma.log.create({
      data: {
        severity: 'info',
        message: 'Test log message',
        pageId: page.id,
        userId: user.id,
      },
    });

    console.log('Created test log:', log);

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();