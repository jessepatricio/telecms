import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function initializeDatabase(): Promise<void> {
  try {
    console.log('Initializing PostgreSQL database...');
    
    // Test connection
    await prisma.$connect();
    console.log('PostgreSQL connection established successfully.');
    
    // Clear existing data and reset
    await prisma.image.deleteMany();
    await prisma.job.deleteMany();
    await prisma.task.deleteMany();
    await prisma.reinstatement.deleteMany();
    await prisma.cabinet.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    
    console.log('Database tables cleared successfully.');
    
    // Create default roles
    const adminRole = await prisma.role.create({
      data: {
        name: 'admin',
        description: 'Administrator role with full access',
        permissions: ['read', 'write', 'delete', 'admin']
      }
    });
    
    await prisma.role.create({
      data: {
        name: 'user',
        description: 'Standard user role',
        permissions: ['read', 'write']
      }
    });
    
    console.log('Default roles created successfully.');
    
    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        firstname: 'Admin',
        lastname: 'User',
        email: 'admin@telecms.com',
        password: hashedPassword,
        roleId: adminRole.id
      }
    });
    
    console.log('Default admin user created successfully.');
    console.log('Username: admin');
    console.log('Password: admin123');
    
    // Create sample data
    const sampleCabinet = await prisma.cabinet.create({
      data: {
        name: 'Cabinet-001',
        location: 'Main Street',
        status: 'active'
      }
    });
    
    const sampleTask = await prisma.task.create({
      data: {
        title: 'Install new cables',
        description: 'Install new fiber optic cables in cabinet',
        status: 'pending',
        assignedToId: adminUser.id
      }
    });
    
    await prisma.job.create({
      data: {
        title: 'Maintenance Job',
        description: 'Regular maintenance of cabinet',
        status: 'pending',
        assignedToId: adminUser.id,
        cabinetId: sampleCabinet.id,
        taskId: sampleTask.id
      }
    });
    
    console.log('Sample data created successfully.');
    console.log('Database initialization completed!');
    
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run initialization if this script is executed directly
if (require.main === module) {
  initializeDatabase();
}

export default initializeDatabase;

