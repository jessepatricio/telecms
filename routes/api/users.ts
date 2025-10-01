import express from 'express';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { authenticateToken, requireAdmin } from '../../middleware/auth';
import { validateUser, validateUserUpdate, validateId, validatePagination } from '../../middleware/validation';
import { asyncHandler } from '../../middleware/errorHandler';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken as any);

// Get all users
router.get('/', validatePagination, asyncHandler(async (req: express.Request, res: express.Response) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      include: { role: true },
      skip: offset,
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count()
  ]);

  return res.json({
    users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
}));

// Get user by ID
router.get('/:id', validateId, asyncHandler(async (req: express.Request, res: express.Response) => {
  const userId = parseInt(req.params['id']!);
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true }
  });
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  return res.json(user);
}));

// Create new user (Admin only)
router.post('/', requireAdmin as any, validateUser, asyncHandler(async (req: express.Request, res: express.Response) => {
  const { username, firstname, lastname, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // Check if email already exists
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      firstname,
      lastname,
      email,
      password: hashedPassword,
      roleId: role
    },
    include: { role: true }
  });

  return res.status(201).json(user);
}));

// Update user
router.put('/:id', validateId, validateUserUpdate, asyncHandler(async (req: express.Request, res: express.Response) => {
  const { username, firstname, lastname, email, role, password } = req.body;
  const userId = parseInt(req.params['id']!);
  
  const updateData: any = { username, firstname, lastname, email, roleId: role };

  // Hash password if provided
  if (password) {
    updateData.password = await bcrypt.hash(password, 12);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    include: { role: true }
  });

  return res.json(user);
}));

// Delete user (Admin only)
router.delete('/:id', requireAdmin as any, validateId, asyncHandler(async (req: express.Request, res: express.Response) => {
  const userId = parseInt(req.params['id']!);
  
  await prisma.user.delete({
    where: { id: userId }
  });
  
  return res.json({ message: 'User deleted successfully' });
}));

export default router;
