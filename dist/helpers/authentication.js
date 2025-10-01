"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthenticated = void 0;
const userAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};
exports.userAuthenticated = userAuthenticated;
exports.default = {
    userAuthenticated: exports.userAuthenticated
};
//# sourceMappingURL=authentication.js.map