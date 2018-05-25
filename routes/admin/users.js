const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Role = require('../../models/Role');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    User.find({})
        .populate('rolename')
        .then(users => {
            res.render('admin/users', {
                users: users
            });
        });
});

router.get('/create', (req, res) => {
    Role.find({}).then(roles => {
        res.render('admin/users/create', {
            roles: roles
        });
    });
});

router.post('/create', (req, res) => {

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

        res.render('admin/users/create', {
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
                req.flash('info_message', 'That email is already added.');
                res.redirect('/admin/users');
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
                            res.redirect('/admin/users');
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
                res.redirect('/admin/users');
            });
        });

});





module.exports = router;