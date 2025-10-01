"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = exports.uploadDir = void 0;
const path_1 = __importDefault(require("path"));
exports.uploadDir = path_1.default.join(__dirname, '../public/uploads/');
const isEmpty = function (obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};
exports.isEmpty = isEmpty;
exports.default = {
    uploadDir: exports.uploadDir,
    isEmpty: exports.isEmpty
};
//# sourceMappingURL=upload-helpers.js.map