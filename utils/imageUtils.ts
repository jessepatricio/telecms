export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  size?: number;
  mimeType?: string;
}

export interface ProcessedImage {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  data: string;
}

export class ImageValidator {
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];

  static validateBase64Image(base64String: string, originalName: string): ImageValidationResult {
    try {
      // Check if it's a valid base64 string
      if (!base64String || typeof base64String !== 'string') {
        return { isValid: false, error: 'Invalid base64 string' };
      }

      // Remove data URL prefix if present
      const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
      
      // Validate base64 format
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
        return { isValid: false, error: 'Invalid base64 format' };
      }

      // Calculate size from base64 string
      const size = Math.round((base64Data.length * 3) / 4);
      
      if (size > this.MAX_FILE_SIZE) {
        return { 
          isValid: false, 
          error: `File size ${Math.round(size / 1024 / 1024 * 100) / 100}MB exceeds maximum allowed size of ${Math.round(this.MAX_FILE_SIZE / 1024 / 1024)}MB` 
        };
      }

      // Determine MIME type from base64 header or file extension
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
    } catch (error) {
      return { 
        isValid: false, 
        error: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  private static getMimeTypeFromBase64(base64String: string): string | null {
    const matches = base64String.match(/^data:([A-Za-z0-9+/]+);base64,/);
    return matches ? matches[1] : null;
  }

  private static getMimeTypeFromExtension(filename: string): string | null {
    const extension = filename.toLowerCase().split('.').pop();
    const mimeMap: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp'
    };
    return extension ? mimeMap[extension] || null : null;
  }
}

export class ImageProcessor {
  static processBase64Image(base64String: string, originalName: string): ProcessedImage {
    const validation = ImageValidator.validateBase64Image(base64String, originalName);
    
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid image');
    }

    // Remove data URL prefix if present
    const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Generate unique filename
    const timestamp = Date.now();
    const extension = originalName.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;

    return {
      filename,
      originalName,
      mimeType: validation.mimeType!,
      size: validation.size!,
      data: base64Data
    };
  }

  static generateThumbnail(base64Data: string, maxWidth: number = 200, maxHeight: number = 200): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Calculate thumbnail dimensions
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw thumbnail
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64
        const thumbnailBase64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnailBase64);
      };
      
      img.onerror = () => reject(new Error('Could not load image'));
      img.src = `data:image/jpeg;base64,${base64Data}`;
    });
  }
}
