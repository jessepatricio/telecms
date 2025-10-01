import express from 'express';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateLogin } from '../../middleware/validation';
import { asyncHandler } from '../../middleware/errorHandler';

const router = express.Router();


// Login endpoint
router.post('/login', validateLogin, asyncHandler(async (req: express.Request, res: express.Response) => {
  const { username, password } = req.body;

  // Find user by username with role
  const user = await prisma.user.findUnique({ 
    where: { username },
    include: { role: true }
  });
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: user.id,
      username: user.username,
      role: user.role?.name || 'user'
    },
    'fallback-secret',
    { expiresIn: '24h' }
  );

  // Return user data and token
  return res.json({
    token,
    user: {
      _id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role?.name || 'user'
    }
  });
}));

// Verify token endpoint
router.get('/verify', asyncHandler(async (req: express.Request, res: express.Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = jwt.verify(token, 'fallback-secret') as any;
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: { role: true }
  });
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  return res.json({ 
    user: {
      _id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role?.name || 'user'
    }
  });
}));

export default router;
