import { PrismaClient } from '@prisma/client';
import { hashPassword } from './password';
import logger from './logger';

const prisma = new PrismaClient();

async function main() {
  logger.info('Starting database seeding...');

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Administrator' },
    update: {},
    create: {
      name: 'Administrator',
      description: 'Full system access',
      permissions: ['read', 'write', 'delete', 'admin']
    }
  });

  const supervisorRole = await prisma.role.upsert({
    where: { name: 'Supervisor' },
    update: {},
    create: {
      name: 'Supervisor',
      description: 'Supervisory access',
      permissions: ['read', 'write', 'manage_users', 'manage_roles', 'manage_cabinets', 'manage_jobs', 'manage_tasks', 'view_reports', 'manage_reinstatements']
    }
  });

  const technicianRole = await prisma.role.upsert({
    where: { name: 'Technician' },
    update: {},
    create: {
      name: 'Technician',
      description: 'Basic technician access',
      permissions: ['read', 'write']
    }
  });

  logger.info('Roles created successfully');

  // Create admin user
  const adminPassword = await hashPassword('Admin123!');
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      password: adminPassword,
      firstname: 'System',
      lastname: 'Administrator',
      email: 'admin@tcts.com',
      roleId: adminRole.id,
      isActive: true
    },
    create: {
      username: 'admin',
      firstname: 'System',
      lastname: 'Administrator',
      email: 'admin@tcts.com',
      password: adminPassword,
      roleId: adminRole.id,
      isActive: true
    }
  });

  // Create supervisor user
  const supervisorPassword = await hashPassword('Supervisor123!');
  const supervisorUser = await prisma.user.upsert({
    where: { username: 'supervisor' },
    update: {},
    create: {
      username: 'supervisor',
      firstname: 'John',
      lastname: 'Supervisor',
      email: 'supervisor@tcts.com',
      password: supervisorPassword,
      roleId: supervisorRole.id,
      isActive: true
    }
  });

  // Create technician user
  const technicianPassword = await hashPassword('Technician123!');
  const technicianUser = await prisma.user.upsert({
    where: { username: 'technician' },
    update: {},
    create: {
      username: 'technician',
      firstname: 'Jane',
      lastname: 'Technician',
      email: 'technician@tcts.com',
      password: technicianPassword,
      roleId: technicianRole.id,
      isActive: true
    }
  });

  logger.info('Users created successfully');

  // Create sample cabinets
  const cabinet1 = await prisma.cabinet.upsert({
    where: { name: 'CAB-001' },
    update: {},
    create: {
      name: 'CAB-001',
      location: 'Main Street, Downtown',
      status: 'ACTIVE',
      description: 'Main distribution cabinet',
      assignedTo: 'John Supervisor'
    }
  });

  const cabinet2 = await prisma.cabinet.upsert({
    where: { name: 'CAB-002' },
    update: {},
    create: {
      name: 'CAB-002',
      location: 'Oak Avenue, Residential',
      status: 'ACTIVE',
      description: 'Residential area cabinet',
      assignedTo: 'Jane Technician'
    }
  });

  const cabinet3 = await prisma.cabinet.upsert({
    where: { name: 'CAB-003' },
    update: {},
    create: {
      name: 'CAB-003',
      location: 'Industrial Zone',
      status: 'MAINTENANCE',
      description: 'Industrial zone cabinet - under maintenance',
      assignedTo: 'John Supervisor'
    }
  });

  logger.info('Cabinets created successfully');

  // Create sample tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Install new fiber connection',
      description: 'Install fiber connection for new customer at Main Street',
      status: 'PENDING',
      priority: 'HIGH',
      assignedToId: technicianUser.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    }
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Maintenance check CAB-003',
      description: 'Perform routine maintenance on industrial zone cabinet',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      assignedToId: supervisorUser.id,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
    }
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Update network documentation',
      description: 'Update network documentation for all cabinets',
      status: 'PENDING',
      priority: 'LOW',
      assignedToId: technicianUser.id,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    }
  });

  logger.info('Tasks created successfully');

  // Create sample jobs
  const job1 = await prisma.job.create({
    data: {
      title: 'Fiber Installation - Main Street',
      description: 'Install fiber connection for new customer',
      status: 'PENDING',
      assignedToId: technicianUser.id,
      addedById: supervisorUser.id,
      cabinetId: cabinet1.id,
      taskId: task1.id,
      lno: 'LNO-2024-001',
      withDig: true,
      withBackfill: false,
      remarks: 'Customer requested installation',
      streetNo: '123',
      streetName: 'Main Street',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  const job2 = await prisma.job.create({
    data: {
      title: 'Cabinet Maintenance - Industrial Zone',
      description: 'Perform maintenance on industrial zone cabinet',
      status: 'IN_PROGRESS',
      assignedToId: supervisorUser.id,
      addedById: adminUser.id,
      cabinetId: cabinet3.id,
      taskId: task2.id,
      lno: 'LNO-2024-002',
      withDig: false,
      withBackfill: false,
      remarks: 'Routine maintenance',
      streetNo: '456',
      streetName: 'Industrial Boulevard',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    }
  });

  logger.info('Jobs created successfully');

  // Create sample reinstatements
  const reinstatement1 = await prisma.reinstatement.create({
    data: {
      title: 'Street Reinstatement - Main Street',
      description: 'Reinstate street after fiber installation',
      status: 'PENDING',
      assignedToId: technicianUser.id,
      cabinetId: cabinet1.id,
      streetLocation: 'Main Street, Downtown',
      length: 10.5,
      width: 2.0
    }
  });

  const reinstatement2 = await prisma.reinstatement.create({
    data: {
      title: 'Sidewalk Reinstatement - Oak Avenue',
      description: 'Reinstate sidewalk after maintenance work',
      status: 'COMPLETED',
      assignedToId: supervisorUser.id,
      cabinetId: cabinet2.id,
      streetLocation: 'Oak Avenue, Residential',
      length: 5.0,
      width: 1.5,
      completedAt: new Date()
    }
  });

  logger.info('Reinstatements created successfully');

  logger.info('Database seeding completed successfully!');
  logger.info('Created:');
  logger.info(`- 3 roles (Administrator, Supervisor, Technician)`);
  logger.info(`- 3 users (admin, supervisor, technician)`);
  logger.info(`- 3 cabinets (CAB-001, CAB-002, CAB-003)`);
  logger.info(`- 3 tasks`);
  logger.info(`- 2 jobs`);
  logger.info(`- 2 reinstatements`);
  logger.info('');
  logger.info('Default login credentials:');
  logger.info('Admin: admin / Admin123!');
  logger.info('Supervisor: supervisor / Supervisor123!');
  logger.info('Technician: technician / Technician123!');
}

main()
  .catch((e) => {
    logger.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
