import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { ApiResponse } from '@/types';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const response: ApiResponse = {
      success: false,
      message: 'Validation failed',
      error: errors.array().map(err => `${err.type === 'field' ? err.path : 'unknown'}: ${err.msg}`).join(', ')
    };
    
    return res.status(400).json(response);
  }
  
  return next();
};

// Auth validation
export const validateLogin = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  handleValidationErrors
];

export const validateRegister = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('firstname')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastname')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('roleId')
    .isInt({ min: 1 })
    .withMessage('Valid role ID is required'),
  handleValidationErrors
];

// User validation
export const validateCreateUser = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('firstname')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastname')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('roleId')
    .isInt({ min: 1 })
    .withMessage('Valid role ID is required'),
  handleValidationErrors
];

export const validateUpdateUser = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('firstname')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastname')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('roleId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid role ID is required'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  handleValidationErrors
];

// Role validation
export const validateCreateRole = [
  body('name')
    .notEmpty()
    .withMessage('Role name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Role name must be between 2 and 50 characters'),
  body('description')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Description must be less than 255 characters'),
  body('permissions')
    .optional()
    .isArray()
    .withMessage('Permissions must be an array'),
  handleValidationErrors
];

export const validateUpdateRole = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Role name must be between 2 and 50 characters'),
  body('description')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Description must be less than 255 characters'),
  body('permissions')
    .optional()
    .isArray()
    .withMessage('Permissions must be an array'),
  handleValidationErrors
];

// Task validation
export const validateCreateTask = [
  body('title')
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .withMessage('Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Priority must be one of: LOW, MEDIUM, HIGH'),
  body('assignedToId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Assigned user ID must be a positive integer'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  handleValidationErrors
];

export const validateUpdateTask = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .withMessage('Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Priority must be one of: LOW, MEDIUM, HIGH'),
  body('assignedToId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Assigned user ID must be a positive integer'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  handleValidationErrors
];

// Cabinet validation
export const validateCreateCabinet = [
  body('name')
    .notEmpty()
    .withMessage('Cabinet name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('location')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Location must be less than 255 characters'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'OFFLINE'])
    .withMessage('Status must be one of: ACTIVE, INACTIVE, MAINTENANCE, OFFLINE'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('assignedTo')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Assigned to must be less than 100 characters'),
  handleValidationErrors
];

export const validateUpdateCabinet = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('location')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Location must be less than 255 characters'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'OFFLINE'])
    .withMessage('Status must be one of: ACTIVE, INACTIVE, MAINTENANCE, OFFLINE'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('assignedTo')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Assigned to must be less than 100 characters'),
  handleValidationErrors
];

// Job validation
export const validateCreateJob = [
  body('title')
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .withMessage('Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED'),
  body('assignedToId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Assigned user ID must be a positive integer'),
  body('cabinetId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Cabinet ID must be a positive integer'),
  body('taskId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Task ID must be a positive integer'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  handleValidationErrors
];

export const validateUpdateJob = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .withMessage('Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED'),
  body('assignedToId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Assigned user ID must be a positive integer'),
  body('cabinetId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Cabinet ID must be a positive integer'),
  body('taskId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Task ID must be a positive integer'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  handleValidationErrors
];

// Reinstatement validation
export const validateCreateReinstatement = [
  body('title')
    .notEmpty()
    .withMessage('Reinstatement title is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .withMessage('Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED'),
  body('assignedToId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Assigned user ID must be a positive integer'),
  body('cabinetId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Cabinet ID must be a positive integer'),
  body('streetLocation')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Street location must be less than 255 characters'),
  body('length')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Length must be a positive number'),
  body('width')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Width must be a positive number'),
  handleValidationErrors
];

export const validateUpdateReinstatement = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .withMessage('Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED'),
  body('assignedToId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Assigned user ID must be a positive integer'),
  body('cabinetId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Cabinet ID must be a positive integer'),
  body('streetLocation')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Street location must be less than 255 characters'),
  body('length')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Length must be a positive number'),
  body('width')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Width must be a positive number'),
  handleValidationErrors
];

// ID parameter validation
export const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  handleValidationErrors
];

// Query parameter validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sortBy')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Sort by field must be between 1 and 50 characters'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc'),
  handleValidationErrors
];
