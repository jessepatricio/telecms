"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUploadedFile = exports.uploadImages = exports.uploadDocument = exports.uploadImage = exports.uploadFields = exports.uploadMultiple = exports.uploadSingle = exports.handleUploadError = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const errorHandler_1 = require("./errorHandler");
const logger_1 = __importDefault(require("../utils/logger"));
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        logger_1.default.warn(`Blocked file upload attempt: ${file.originalname} (${file.mimetype})`, {
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
        cb(new errorHandler_1.AppError('File type not allowed', 400));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 5,
        fields: 10,
        fieldNameSize: 100,
        fieldSize: 1024 * 1024,
        parts: 1000
    }
});
const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer_1.default.MulterError) {
        let message = 'File upload error';
        switch (error.code) {
            case 'LIMIT_FILE_SIZE':
                message = 'File too large. Maximum size is 10MB.';
                break;
            case 'LIMIT_FILE_COUNT':
                message = 'Too many files. Maximum is 5 files.';
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                message = 'Unexpected field name in file upload.';
                break;
            case 'LIMIT_PART_COUNT':
                message = 'Too many parts in the multipart request.';
                break;
            case 'LIMIT_FIELD_COUNT':
                message = 'Too many fields in the request.';
                break;
            case 'LIMIT_FIELD_KEY':
                message = 'Field name too long.';
                break;
            case 'LIMIT_FIELD_VALUE':
                message = 'Field value too long.';
                break;
            default:
                message = 'File upload error occurred.';
        }
        logger_1.default.error('Multer error:', {
            code: error.code,
            message: error.message,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
        return res.status(400).json({
            success: false,
            message,
            error: 'File upload failed'
        });
    }
    next(error);
};
exports.handleUploadError = handleUploadError;
const uploadSingle = (fieldName) => [
    upload.single(fieldName),
    exports.handleUploadError
];
exports.uploadSingle = uploadSingle;
const uploadMultiple = (fieldName, maxCount = 5) => [
    upload.array(fieldName, maxCount),
    exports.handleUploadError
];
exports.uploadMultiple = uploadMultiple;
const uploadFields = (fields) => [
    upload.fields(fields),
    exports.handleUploadError
];
exports.uploadFields = uploadFields;
exports.uploadImage = (0, exports.uploadSingle)('image');
exports.uploadDocument = (0, exports.uploadSingle)('document');
exports.uploadImages = (0, exports.uploadMultiple)('images', 5);
const validateUploadedFile = (file) => {
    if (!file) {
        throw new errorHandler_1.AppError('No file uploaded', 400);
    }
    const fileExtension = path_1.default.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.txt', '.doc', '.docx'];
    if (!allowedExtensions.includes(fileExtension)) {
        throw new errorHandler_1.AppError('File extension not allowed', 400);
    }
    const suspiciousPatterns = [
        /\.\./,
        /[<>:"|?*]/,
        /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i
    ];
    for (const pattern of suspiciousPatterns) {
        if (pattern.test(file.originalname)) {
            throw new errorHandler_1.AppError('Invalid file name', 400);
        }
    }
    return true;
};
exports.validateUploadedFile = validateUploadedFile;
exports.default = upload;
//# sourceMappingURL=upload.js.map