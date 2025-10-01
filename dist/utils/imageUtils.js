"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageProcessor = exports.ImageValidator = void 0;
class ImageValidator {
    static MAX_FILE_SIZE = 5 * 1024 * 1024;
    static ALLOWED_MIME_TYPES = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
    ];
    static validateBase64Image(base64String, originalName) {
        try {
            if (!base64String || typeof base64String !== 'string') {
                return { isValid: false, error: 'Invalid base64 string' };
            }
            const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
            if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
                return { isValid: false, error: 'Invalid base64 format' };
            }
            const size = Math.round((base64Data.length * 3) / 4);
            if (size > this.MAX_FILE_SIZE) {
                return {
                    isValid: false,
                    error: `File size ${Math.round(size / 1024 / 1024 * 100) / 100}MB exceeds maximum allowed size of ${Math.round(this.MAX_FILE_SIZE / 1024 / 1024)}MB`
                };
            }
            let mimeType = this.getMimeTypeFromBase64(base64String) || this.getMimeTypeFromExtension(originalName);
            if (!mimeType || !this.ALLOWED_MIME_TYPES.includes(mimeType)) {
                return {
                    isValid: false,
                    error: `Unsupported file type. Allowed types: ${this.ALLOWED_MIME_TYPES.join(', ')}`
                };
            }
            return {
                isValid: true,
                size,
                mimeType
            };
        }
        catch (error) {
            return {
                isValid: false,
                error: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    static getMimeTypeFromBase64(base64String) {
        const matches = base64String.match(/^data:([A-Za-z0-9+/]+);base64,/);
        return matches ? matches[1] : null;
    }
    static getMimeTypeFromExtension(filename) {
        const extension = filename.toLowerCase().split('.').pop();
        const mimeMap = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp'
        };
        return extension ? mimeMap[extension] || null : null;
    }
}
exports.ImageValidator = ImageValidator;
class ImageProcessor {
    static processBase64Image(base64String, originalName) {
        const validation = ImageValidator.validateBase64Image(base64String, originalName);
        if (!validation.isValid) {
            throw new Error(validation.error || 'Invalid image');
        }
        const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
        const timestamp = Date.now();
        const extension = originalName.split('.').pop() || 'jpg';
        const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;
        return {
            filename,
            originalName,
            mimeType: validation.mimeType,
            size: validation.size,
            data: base64Data
        };
    }
    static generateThumbnail(base64Data, maxWidth = 200, maxHeight = 200) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }
                let { width, height } = img;
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                }
                else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                const thumbnailBase64 = canvas.toDataURL('image/jpeg', 0.8);
                resolve(thumbnailBase64);
            };
            img.onerror = () => reject(new Error('Could not load image'));
            img.src = `data:image/jpeg;base64,${base64Data}`;
        });
    }
}
exports.ImageProcessor = ImageProcessor;
//# sourceMappingURL=imageUtils.js.map