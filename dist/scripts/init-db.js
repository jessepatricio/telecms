"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function initializeDatabase() {
    try {
        console.log('Initializing PostgreSQL database...');
        await prisma_1.prisma.$connect();
        console.log('PostgreSQL connection established successfully.');
        await prisma_1.prisma.image.deleteMany();
        await prisma_1.prisma.job.deleteMany();
        await prisma_1.prisma.task.deleteMany();
        await prisma_1.prisma.reinstatement.deleteMany();
        await prisma_1.prisma.cabinet.deleteMany();
        await prisma_1.prisma.user.deleteMany();
        await prisma_1.prisma.role.deleteMany();
        console.log('Database tables cleared successfully.');
        const adminRole = await prisma_1.prisma.role.create({
            data: {
                name: 'admin',
                description: 'Administrator role with full access',
                permissions: ['read', 'write', 'delete', 'admin']
            }
        });
        await prisma_1.prisma.role.create({
            data: {
                name: 'user',
                description: 'Standard user role',
                permissions: ['read', 'write']
            }
        });
        console.log('Default roles created successfully.');
        const hashedPassword = await bcryptjs_1.default.hash('admin123', 10);
        const adminUser = await prisma_1.prisma.user.create({
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
        const sampleCabinet = await prisma_1.prisma.cabinet.create({
            data: {
                name: 'Cabinet-001',
                location: 'Main Street',
                status: 'active'
            }
        });
        const sampleTask = await prisma_1.prisma.task.create({
            data: {
                title: 'Install new cables',
                description: 'Install new fiber optic cables in cabinet',
                status: 'pending',
                assignedToId: adminUser.id
            }
        });
        await prisma_1.prisma.job.create({
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
    }
    catch (error) {
        console.error('Error initializing database:', error);
    }
    finally {
        await prisma_1.prisma.$disconnect();
    }
}
if (require.main === module) {
    initializeDatabase();
}
exports.default = initializeDatabase;
//# sourceMappingURL=init-db.js.map