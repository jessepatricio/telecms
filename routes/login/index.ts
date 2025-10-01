import express from 'express';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

const router = express.Router();

router.all('/*', (_req: express.Request, _res: express.Response, next: express.NextFunction) => {
    (_req.app.locals as any).layout = 'login';
    next();
});

router.get('/', (_req: express.Request, res: express.Response) => {
    res.render('login/index');
});

router.get('/login', (_req: express.Request, res: express.Response) => {
    res.render('login/index');
});

//app login
passport.use(new LocalStrategy({
    //usernameField: 'email'
}, async (username: string, password: string, done: (error: any, user?: any, info?: any) => void) => {
    try {
        const user = await prisma.user.findUnique({
            where: { username: username }
        });

        if (!user) return done(null, false, {
            message: 'No user found!'
        });

        bcrypt.compare(password, user.password, (err, matched) => {
            if (err) throw err;
            if (matched) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
        });
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user: any, done: (error: any, id?: any) => void) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: any, done: (error: any, user?: any) => void) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

router.post('/login', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req: express.Request, res: express.Response) => {
    (req as any).logOut();
    res.redirect('/login');
});

export default router;
