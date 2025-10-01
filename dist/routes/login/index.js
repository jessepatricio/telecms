"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const router = express_1.default.Router();
router.all('/*', (_req, _res, next) => {
    _req.app.locals.layout = 'login';
    next();
});
router.get('/', (_req, res) => {
    res.render('login/index');
});
router.get('/login', (_req, res) => {
    res.render('login/index');
});
passport_1.default.use(new passport_local_1.Strategy({}, async (username, password, done) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { username: username }
        });
        if (!user)
            return done(null, false, {
                message: 'No user found!'
            });
        bcryptjs_1.default.compare(password, user.password, (err, matched) => {
            if (err)
                throw err;
            if (matched) {
                return done(null, user);
            }
            else {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
        });
    }
    catch (error) {
        return done(error, null);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: parseInt(id) }
        });
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
});
router.post('/login', (req, res, next) => {
    passport_1.default.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});
exports.default = router;
//# sourceMappingURL=index.js.map