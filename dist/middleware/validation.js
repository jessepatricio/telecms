"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validatePagination = exports.validateId = exports.validateReinstatement = exports.validateCabinet = exports.validateTask = exports.validateJob = exports.validateUserUpdate = exports.validateUser = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
        return;
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
exports.validateUser = [
    (0, express_validator_1.body)('username')
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    (0, express_validator_1.body)('firstname')
        .isLength({ min: 1, max: 50 })
        .withMessage('First name is required and must be less than 50 characters')
        .trim(),
    (0, express_validator_1.body)('lastname')
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name is required and must be less than 50 characters')
        .trim(),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('role')
        .isInt({ min: 1 })
        .withMessage('Valid role ID is required'),
    exports.handleValidationErrors
];
exports.validateUserUpdate = [
    (0, express_validator_1.body)('username')
        .optional()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    (0, express_validator_1.body)('firstname')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('First name must be less than 50 characters')
        .trim(),
    (0, express_validator_1.body)('lastname')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name must be less than 50 characters')
        .trim(),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('role')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Valid role ID is required'),
    exports.handleValidationErrors
];
exports.validateJob = [
    (0, express_validator_1.body)('title')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title is required and must be less than 200 characters')
        .trim(),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters')
        .trim(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
        .withMessage('Status must be one of: pending, in_progress, completed, cancelled'),
    (0, express_validator_1.body)('assignedTo')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Assigned user ID must be a positive integer'),
    (0, express_validator_1.body)('cabinet')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Cabinet ID must be a positive integer'),
    (0, express_validator_1.body)('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Due date must be a valid ISO 8601 date'),
    (0, express_validator_1.body)('streetNo')
        .optional()
        .isLength({ max: 20 })
        .withMessage('Street number must be less than 20 characters'),
    (0, express_validator_1.body)('streetName')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Street name must be less than 100 characters'),
    (0, express_validator_1.body)('lno')
        .optional()
        .isLength({ max: 50 })
        .withMessage('LNO must be less than 50 characters'),
    (0, express_validator_1.body)('remarks')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Remarks must be less than 500 characters'),
    exports.handleValidationErrors
];
exports.validateTask = [
    (0, express_validator_1.body)('title')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title is required and must be less than 200 characters')
        .trim(),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters')
        .trim(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
        .withMessage('Status must be one of: pending, in_progress, completed, cancelled'),
    (0, express_validator_1.body)('assignedToId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Assigned user ID must be a positive integer'),
    (0, express_validator_1.body)('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Due date must be a valid ISO 8601 date'),
    exports.handleValidationErrors
];
exports.validateCabinet = [
    (0, express_validator_1.body)('name')
        .isLength({ min: 1, max: 100 })
        .withMessage('Name is required and must be less than 100 characters')
        .trim(),
    (0, express_validator_1.body)('location')
        .optional()
        .isLength({ max: 200 })
        .withMessage('Location must be less than 200 characters')
        .trim(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['active', 'inactive', 'maintenance'])
        .withMessage('Status must be one of: active, inactive, maintenance'),
    exports.handleValidationErrors
];
exports.validateReinstatement = [
    (0, express_validator_1.body)('title')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title is required and must be less than 200 characters')
        .trim(),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters')
        .trim(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
        .withMessage('Status must be one of: pending, in_progress, completed, cancelled'),
    (0, express_validator_1.body)('assignedToId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Assigned user ID must be a positive integer'),
    (0, express_validator_1.body)('cabinetId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Cabinet ID must be a positive integer'),
    (0, express_validator_1.body)('streetNo')
        .optional()
        .isLength({ max: 20 })
        .withMessage('Street number must be less than 20 characters'),
    (0, express_validator_1.body)('streetName')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Street name must be less than 100 characters'),
    (0, express_validator_1.body)('length')
        .optional()
        .isDecimal()
        .withMessage('Length must be a valid decimal number'),
    (0, express_validator_1.body)('width')
        .optional()
        .isDecimal()
        .withMessage('Width must be a valid decimal number'),
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
    exports.handleValidationErrors
];
exports.validateLogin = [
    (0, express_validator_1.body)('username')
        .notEmpty()
        .withMessage('Username is required')
        .trim(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
    exports.handleValidationErrors
];
//# sourceMappingURL=validation.js.map