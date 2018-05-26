const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'login';
    next();
});

router.get('/', (req, res) => {

    //console.log('congratualations on your new node.js app');

    res.render('login/index');

});


router.get('/login', (req, res) => {

    //console.log('congratualations on your new node.js app');

    res.render('login/index');

});

//app login
passport.use(new LocalStrategy({
    usernameField: 'email'
}, (email, password, done) => {

    //console.log(email);
    User.findOne({
        email: email
    }).then(user => {

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

    });

}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});



router.post('/login', (req, res, next) => {

    passport.authenticate('local', {

        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true

    })(req, res, next);
});

router.get('/logout', (req, res) => {

    req.logOut();
    res.redirect('/login');

});

module.exports = router;