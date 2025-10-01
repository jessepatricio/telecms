"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePagination = exports.validateId = exports.validateUpdateReinstatement = exports.validateCreateReinstatement = exports.validateUpdateJob = exports.validateCreateJob = exports.validateUpdateCabinet = exports.validateCreateCabinet = exports.validateUpdateTask = exports.validateCreateTask = exports.validateUpdateRole = exports.validateCreateRole = exports.validateUpdateUser = exports.validateCreateUser = exports.validateRegister = exports.validateLogin = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const response = {
            success: false,
            message: 'Validation failed',
            error: errors.array().map(err => `${err.type === 'field' ? err.path : 'unknown'}: ${err.msg}`).join(', ')
        };
        return res.status(400).json(response);
    }
    return next();
};
exports.handleValidationErrors = handleValidationErrors;
exports.validateLogin = [
    (0, express_validator_1.body)('username')
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    exports.handleValidationErrors
];
exports.validateRegister = [
    (0, express_validator_1.body)('username')
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    (0, express_validator_1.body)('firstname')
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('lastname')
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    (0, express_validator_1.body)('roleId')
        .isInt({ min: 1 })
        .withMessage('Valid role ID is required'),
    exports.handleValidationErrors
];
exports.validateCreateUser = [
    (0, express_validator_1.body)('username')
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    (0, express_validator_1.body)('firstname')
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('lastname')
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    (0, express_validator_1.body)('roleId')
        .isInt({ min: 1 })
        .withMessage('Valid role ID is required'),
    exports.handleValidationErrors
];
exports.validateUpdateUser = [
    (0, express_validator_1.body)('username')
        .optional()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    (0, express_validator_1.body)('firstname')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('lastname')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .optional()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    (0, express_validator_1.body)('roleId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Valid role ID is required'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    exports.handleValidationErrors
];
exports.validateCreateRole = [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Role name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Role name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Description must be less than 255 characters'),
    (0, express_validator_1.body)('permissions')
        .optional()
        .isArray()
        .withMessage('Permissions must be an array'),
    exports.handleValidationErrors
];
exports.validateUpdateRole = [
    (0, express_validator_1.body)('name')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Role name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Description must be less than 255 characters'),
    (0, express_validator_1.body)('permissions')
        .optional()
        .isArray()
        .withMessage('Permissions must be an array'),
    exports.handleValidationErrors
];
exports.validateCreateTask = [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Task title is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Title must be between 3 and 255 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
        .withMessage('Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED'),
    (0, express_validator_1.body)('priority')
        .optional()
        .isIn(['LOW', 'MEDIUM', 'HIGH'])
        .withMessage('Priority must be one of: LOW, MEDIUM, HIGH'),
    (0, express_validator_1.body)('assignedToId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Assigned user ID must be a positive integer'),
    (0, express_validator_1.body)('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Due date must be a valid date'),
    exports.handleValidationErrors
];
exports.validateUpdateTask = [
    (0, express_validator_1.body)('title')
        .optional()
        .isLength({ min: 3, max: 255 })
        .withMessage('Title must be between 3 and 255 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
        .withMessage('Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED'),
    (0, express_validator_1.body)('priority')
        .optional()
        .isIn(['LOW', 'MEDIUM', 'HIGH'])
        .withMessage('Priority must be one of: LOW, MEDIUM, HIGH'),
    (0, express_validator_1.body)('assignedToId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Assigned user ID must be a positive integer'),
    (0, express_validator_1.body)('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Due date must be a valid date'),
    exports.handleValidationErrors
];
exports.validateCreateCabinet = [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Cabinet name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('location')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Location must be less than 255 characters'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'OFFLINE'])
        .withMessage('Status must be one of: ACTIVE, INACTIVE, MAINTENANCE, OFFLINE'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    (0, express_validator_1.body)('assignedTo')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Assigned to must be less than 100 characters'),
    exports.handleValidationErrors
];
exports.validateUpdateCabinet = [
    (0, express_validator_1.body)('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('location')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Location must be less than 255 characters'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'OFFLINE'])
        .withMessage('Status must be one of: ACTIVE, INACTIVE, MAINTENANCE, OFFLINE'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    (0, express_validator_1.body)('assignedTo')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Assigned to must be less than 100 characters'),
    exports.handleValidationErrors
];
exports.validateCreateJob = [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Job title is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Title must be between 3 and 255 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
        .withMessage('Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED'),
    (0, express_validator_1.body)('assignedToId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Assigned user ID must be a positive integer'),
    (0, express_validator_1.body)('cabinetId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Cabinet ID must be a positive integer'),
    (0, express_validator_1.body)('taskId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Task ID must be a positive integer'),
    (0, express_validator_1.body)('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Due date must be a valid date'),
    exports.handleValidationErrors
];
exports.validateUpdateJob = [
    (0, express_validator_1.body)('title')
        .optional()
        .isLength({ min: 3, max: 255 })
        .withMessage('Title must be between 3 and 255 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
        .withMessage('Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED'),
    (0, express_validator_1.body)('assignedToId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Assigned user ID must be a positive integer'),
    (0, express_validator_1.body)('cabinetId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Cabinet ID must be a positive integer'),
    (0, express_validator_1.body)('taskId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Task ID must be a positive integer'),
    (0, express_validator_1.body)('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Due date must be a valid date'),
    exports.handleValidationErrors
];
exports.validateCreateReinstatement = [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Reinstatement title is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Title must be between 3 and 255 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
        .withMessage('Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED'),
    (0, express_validator_1.body)('assignedToId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Assigned user ID must be a positive integer'),
    (0, express_validator_1.body)('cabinetId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Cabinet ID must be a positive integer'),
    (0, express_validator_1.body)('streetLocation')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Street location must be less than 255 characters'),
    (0, express_validator_1.body)('length')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Length must be a positive number'),
    (0, express_validator_1.body)('width')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Width must be a positive number'),
    exports.handleValidationErrors
];
exports.validateUpdateReinstatement = [
    (0, express_validator_1.body)('title')
        .optional()
        .isLength({ min: 3, max: 255 })
        .withMessage('Title must be between 3 and 255 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
        .withMessage('Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED'),
    (0, express_validator_1.body)('assignedToId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Assigned user ID must be a positive integer'),
    (0, express_validator_1.body)('cabinetId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Cabinet ID must be a positive integer'),
    (0, express_validator_1.body)('streetLocation')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Street location must be less than 255 characters'),
    (0, express_validator_1.body)('length')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Length must be a positive number'),
    (0, express_validator_1.body)('width')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Width must be a positive number'),
    exports.handleValidationErrors
];
exports.validateId = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1 })
        .withMessage('ID must be a positive integer'),
    exports.handleValidationErrors
];
exports.validatePagination = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Sort by field must be between 1 and 50 characters'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be either asc or desc'),
    exports.handleValidationErrors
];
//# sourceMappingURL=validation.js.map