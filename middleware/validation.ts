import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';

// Validation error handler
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
    return;
  }
  next();
};

// User validation rules
export const validateUser = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('firstname')
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be less than 50 characters')
    .trim(),
  
  body('lastname')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be less than 50 characters')
    .trim(),
  
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .isInt({ min: 1 })
    .withMessage('Valid role ID is required'),
  
  handleValidationErrors
];

export const validateUserUpdate = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('firstname')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be less than 50 characters')
    .trim(),
  
  body('lastname')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be less than 50 characters')
    .trim(),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid role ID is required'),
  
  handleValidationErrors
];

// Job validation rules
export const validateJob = [
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
    .trim(),
  
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, in_progress, completed, cancelled'),
  
  body('assignedTo')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Assigned user ID must be a positive integer'),
  
  body('cabinet')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Cabinet ID must be a positive integer'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
  
  body('streetNo')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Street number must be less than 20 characters'),
  
  body('streetName')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Street name must be less than 100 characters'),
  
  body('lno')
    .optional()
    .isLength({ max: 50 })
    .withMessage('LNO must be less than 50 characters'),
  
  body('remarks')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Remarks must be less than 500 characters'),
  
  handleValidationErrors
];

// Task validation rules
export const validateTask = [
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
    .trim(),
  
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, in_progress, completed, cancelled'),
  
  body('assignedToId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Assigned user ID must be a positive integer'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
  
  handleValidationErrors
];

// Cabinet validation rules
export const validateCabinet = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Name is required and must be less than 100 characters')
    .trim(),
  
  body('location')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Location must be less than 200 characters')
    .trim(),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'maintenance'])
    .withMessage('Status must be one of: active, inactive, maintenance'),
  
  handleValidationErrors
];

// Reinstatement validation rules
export const validateReinstatement = [
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
    .trim(),
  
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, in_progress, completed, cancelled'),
  
  body('assignedToId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Assigned user ID must be a positive integer'),
  
  body('cabinetId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Cabinet ID must be a positive integer'),
  
  body('streetNo')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Street number must be less than 20 characters'),
  
  body('streetName')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Street name must be less than 100 characters'),
  
  body('length')
    .optional()
    .isDecimal()
    .withMessage('Length must be a valid decimal number'),
  
  body('width')
    .optional()
    .isDecimal()
    .withMessage('Width must be a valid decimal number'),
  
  handleValidationErrors
];

// ID parameter validation
export const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  
  handleValidationErrors
];

// Pagination validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

// Login validation
export const validateLogin = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .trim(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];
