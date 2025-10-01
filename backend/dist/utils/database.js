"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = globalThis.__prisma || new client_1.PrismaClient({
    log: process.env['NODE_ENV'] === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
});
if (process.env['NODE_ENV'] !== 'production') {
    globalThis.__prisma = exports.prisma;
}
process.on('beforeExit', async () => {
    await exports.prisma.$disconnect();
});
process.on('SIGINT', async () => {
    await exports.prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await exports.prisma.$disconnect();
    process.exit(0);
});
exports.default = exports.prisma;
//# sourceMappingURL=database.js.map