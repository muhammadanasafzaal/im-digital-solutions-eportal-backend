const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import dataset (manually built from your performance sheet image)
const data = require('./seedData.json');

async function main() {
  for (const emp of data.employees) {
    // Ensure employee exists
    let employee = await prisma.employee.upsert({
      where: { email: emp.email },
      update: {},
      create: {
        name: emp.name,
        email: emp.email,
        password: emp.password, // bcrypt hash in real seed
        role: emp.role || 'EMPLOYEE',
      },
    });

    // Insert tasks
    for (const t of emp.tasks) {
      await prisma.task.create({
        data: {
          title: t.title,
          client: t.client,
          assignedTo: employee.id,
          date: new Date(t.date),
          duration: t.duration,
          status: t.status || 'COMPLETED',
          notes: t.notes || null,
        },
      });
    }

    // Insert timelogs if any
    for (const log of emp.timeLogs || []) {
      await prisma.timeLog.create({
        data: {
          employeeId: employee.id,
          date: new Date(log.date),
          timeIn: new Date(log.timeIn),
          timeOut: new Date(log.timeOut),
          duration: log.duration,
        },
      });
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
