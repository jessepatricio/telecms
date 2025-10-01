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
        const { type, startDate, endDate } = req.query;
        let whereClause = {};
        if (startDate && endDate) {
            whereClause.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }
        let data;
        switch (type) {
            case 'jobs':
                data = await prisma_1.prisma.job.findMany({
                    where: whereClause,
                    include: {
                        assignedTo: {
                            select: {
                                firstname: true,
                                lastname: true
                            }
                        },
                        cabinet: {
                            select: {
                                name: true,
                                location: true
                            }
                        }
                    }
                });
                break;
            case 'tasks':
                data = await prisma_1.prisma.task.findMany({
                    where: whereClause,
                    include: {
                        assignedTo: {
                            select: {
                                firstname: true,
                                lastname: true
                            }
                        }
                    }
                });
                break;
            case 'reinstatements':
                data = await prisma_1.prisma.reinstatement.findMany({
                    where: whereClause,
                    include: {
                        assignedTo: {
                            select: {
                                firstname: true,
                                lastname: true
                            }
                        },
                        cabinet: {
                            select: {
                                name: true,
                                location: true
                            }
                        }
                    }
                });
                break;
            default:
                return res.status(400).json({ error: 'Invalid report type' });
        }
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=reports.js.map