"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../../lib/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
router.use(authenticateToken);
router.get('/', async (req, res) => {
    try {
        const [totalUsers, totalTasks, totalJobs, totalCabinets, totalReinstatements, pendingTasks, pendingJobs, completedTasks, completedJobs] = await Promise.all([
            prisma_1.prisma.user.count(),
            prisma_1.prisma.task.count(),
            prisma_1.prisma.job.count(),
            prisma_1.prisma.cabinet.count(),
            prisma_1.prisma.reinstatement.count(),
            prisma_1.prisma.task.count({ where: { status: 'pending' } }),
            prisma_1.prisma.job.count({ where: { status: 'pending' } }),
            prisma_1.prisma.task.count({ where: { status: 'completed' } }),
            prisma_1.prisma.job.count({ where: { status: 'completed' } })
        ]);
        const stats = {
            totalUsers,
            totalTasks,
            totalJobs,
            totalCabinets,
            totalReinstatements,
            pendingTasks,
            pendingJobs,
            completedTasks,
            completedJobs
        };
        res.json(stats);
    }
    catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map