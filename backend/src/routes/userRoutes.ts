import { Router } from 'express';
import { userController } from '@/controllers/userController';
import { authenticate, authorize } from '@/middleware/auth';
import {
  validateCreateUser,
  validateUpdateUser,
  validateId,
  validatePagination
} from '@/middleware/validation';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Get users (with pagination and filtering)
router.get('/', validatePagination, userController.getUsers);

// Get user statistics (admin only)
router.get('/stats', authorize('Administrator'), userController.getUserStats);

// Get user by ID
router.get('/:id', validateId, userController.getUserById);

// Create user (admin only)
router.post('/', authorize('Administrator'), validateCreateUser, userController.createUser);

// Update user (admin only)
router.put('/:id', authorize('Administrator'), validateId, validateUpdateUser, userController.updateUser);

// Delete user (admin only)
router.delete('/:id', authorize('Administrator'), validateId, userController.deleteUser);

// Deactivate user (admin only)
router.patch('/:id/deactivate', authorize('Administrator'), validateId, userController.deactivateUser);

// Activate user (admin only)
router.patch('/:id/activate', authorize('Administrator'), validateId, userController.activateUser);

export default router;
