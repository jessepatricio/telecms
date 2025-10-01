import multer from 'multer';
import { Request } from 'express';
declare const upload: multer.Multer;
export declare const handleUploadError: (error: any, req: Request, res: any, next: any) => any;
export declare const uploadSingle: (fieldName: string) => (import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | ((error: any, req: Request, res: any, next: any) => any))[];
export declare const uploadMultiple: (fieldName: string, maxCount?: number) => (import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | ((error: any, req: Request, res: any, next: any) => any))[];
export declare const uploadFields: (fields: multer.Field[]) => (import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | ((error: any, req: Request, res: any, next: any) => any))[];
export declare const uploadImage: (import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | ((error: any, req: Request, res: any, next: any) => any))[];
export declare const uploadDocument: (import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | ((error: any, req: Request, res: any, next: any) => any))[];
export declare const uploadImages: (import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | ((error: any, req: Request, res: any, next: any) => any))[];
export declare const validateUploadedFile: (file: Express.Multer.File) => boolean;
export default upload;
//# sourceMappingURL=upload.d.ts.map