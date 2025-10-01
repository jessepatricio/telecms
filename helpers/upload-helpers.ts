import path from 'path';

export const uploadDir = path.join(__dirname, '../public/uploads/');

export const isEmpty = function (obj: any): boolean {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};

export default {
    uploadDir,
    isEmpty
};

