import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { AppError } from './errorHandler';
import logger from '../utils/logger';

// Configure multer storage
const storage = multer.memoryStorage();

// File filter function for security
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Define allowed file types
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

  // Check file type
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    logger.warn(`Blocked file upload attempt: ${file.originalname} (${file.mimetype})`, {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    cb(new AppError('File type not allowed', 400));
  }
};

// Configure multer with security limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5, // Maximum 5 files per request
    fields: 10, // Maximum 10 fields per request
    fieldNameSize: 100, // Maximum field name size
    fieldSize: 1024 * 1024, // 1MB field size limit
    parts: 1000 // Maximum number of parts
  }
});

// Middleware to handle multer errors
export const handleUploadError = (error: any, req: Request, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
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

    logger.error('Multer error:', {
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

// Specific upload configurations for different use cases
export const uploadSingle = (fieldName: string) => [
  upload.single(fieldName),
  handleUploadError
];

export const uploadMultiple = (fieldName: string, maxCount: number = 5) => [
  upload.array(fieldName, maxCount),
  handleUploadError
];

export const uploadFields = (fields: multer.Field[]) => [
  upload.fields(fields),
  handleUploadError
];

// Image-specific upload configuration
export const uploadImage = uploadSingle('image');

// Document-specific upload configuration  
export const uploadDocument = uploadSingle('document');

// Multiple images upload
export const uploadImages = uploadMultiple('images', 5);

// Validate uploaded file
export const validateUploadedFile = (file: Express.Multer.File) => {
  if (!file) {
    throw new AppError('No file uploaded', 400);
  }

  // Additional security checks
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.txt', '.doc', '.docx'];
  
  if (!allowedExtensions.includes(fileExtension)) {
    throw new AppError('File extension not allowed', 400);
  }

  // Check for suspicious file names
  const suspiciousPatterns = [
    /\.\./, // Directory traversal
    /[<>:"|?*]/, // Invalid characters
    /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i // Windows reserved names
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(file.originalname)) {
      throw new AppError('Invalid file name', 400);
    }
  }

  return true;
};

export default upload;
