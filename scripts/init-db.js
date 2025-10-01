const { sequelize, User, Role, Task, Cabinet, Job, Reinstatement } = require('../models/sequelize');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
  try {
    console.log('Initializing PostgreSQL database...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('PostgreSQL connection established successfully.');
    
    // Sync database (create tables)
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully.');
    
    // Create default roles
    const adminRole = await Role.create({
      name: 'admin',
      description: 'Administrator role with full access',
      permissions: ['read', 'write', 'delete', 'admin']
    });
    
    const userRole = await Role.create({
      name: 'user',
      description: 'Standard user role',
      permissions: ['read', 'write']
    });
    
    console.log('Default roles created successfully.');
    
    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      username: 'admin',
      firstname: 'Admin',
      lastname: 'User',
      email: 'admin@telecms.com',
      password: hashedPassword,
      roleId: adminRole.id
    });
    
    console.log('Default admin user created successfully.');
    console.log('Username: admin');
    console.log('Password: admin123');
    
    // Create sample data
    const sampleCabinet = await Cabinet.create({
      name: 'Cabinet-001',
      location: 'Main Street',
      status: 'active',
      description: 'Main street cabinet'
    });
    
    const sampleTask = await Task.create({
      title: 'Install new cables',
      description: 'Install new fiber optic cables in cabinet',
      status: 'pending',
      assignedToId: adminUser.id
    });
    
    const sampleJob = await Job.create({
      title: 'Maintenance Job',
      description: 'Regular maintenance of cabinet',
      status: 'pending',
      assignedToId: adminUser.id,
      cabinetId: sampleCabinet.id,
      taskId: sampleTask.id
    });
    
    console.log('Sample data created successfully.');
    console.log('Database initialization completed!');
    
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await sequelize.close();
  }
}

// Run initialization if this script is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
