const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});


router.get('/', (req, res) => {

    //console.log('Your in admin page.');
    res.render('admin/coming');

});

router.get('/register', (req, res) => {

    res.render('admin/register');

});

router.post('/register', (req, res) => {

    let errors = [];

    if (!req.body.firstname) {
        errors.push({
            message: 'please enter your firstname'
        });
    }

    if (!req.body.lastname) {
        errors.push({
            message: 'please add a lastname'
        });
    }

    if (!req.body.email) {
        errors.push({
            message: 'please add an email'
        });
    }

    if (!req.body.password) {
        errors.push({
            message: 'please add a password'
        });
    }

    if (!req.body.passwordConfirm) {
        errors.push({
            message: 'please confirm your password'
        });
    }

    if (req.body.password !== req.body.passwordConfirm) {
        errors.push({
            message: 'Password fields don\'t match'
        });
    }

    if (errors.length > 0) {

        res.render('admin/register', {
            errors: errors,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            role: req.body.role

        });

    } else {

        User.findOne({
            email: req.body.email
        }).then(user => {

            if (user) {
                req.flash('info_message', 'That email is already registered.');
                res.redirect('/admin/userlist');
            } else {
                //res.send('data was good');
                const newUser = new User({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: req.body.password,
                    role: req.body.role
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        //console.log(hash);
                        newUser.password = hash;
                        newUser.save().then(savedUser => {
                            req.flash('success_message', 'User successfully added!');
                            res.redirect('/admin/userlist');
                        });
                    })
                });
            }
        });
    }
});

router.delete('/:id', (req, res) => {

    //remove record 
    User.findOne({
            _id: req.params.id
        })
        .then(user => {
            user.remove().then(userRemoved => {
                req.flash('success_message', 'User was successfully deleted!');
                res.redirect('/admin/userlist');
            });
        });

});



router.get('/userlist', (req, res) => {
    User.find({})
        .then(users => {
            res.render('admin/userlist', {
                users: users
            });
        });
});


module.exports = router;