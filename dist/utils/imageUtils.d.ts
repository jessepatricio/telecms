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
export declare class ImageValidator {
    private static readonly MAX_FILE_SIZE;
    private static readonly ALLOWED_MIME_TYPES;
    static validateBase64Image(base64String: string, originalName: string): ImageValidationResult;
    private static getMimeTypeFromBase64;
    private static getMimeTypeFromExtension;
}
export declare class ImageProcessor {
    static processBase64Image(base64String: string, originalName: string): ProcessedImage;
    static generateThumbnail(base64Data: string, maxWidth?: number, maxHeight?: number): Promise<string>;
}
//# sourceMappingURL=imageUtils.d.ts.map