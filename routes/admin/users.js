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
        .populate('role')
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

    if (!req.body.username) {
        errors.push({
            message: 'please enter your username'
        });
    }


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
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            role: req.body.role

        });

    } else {

        User.findOne({
            username: req.body.username
        }).then(user => {

            if (user) {
                req.flash('info_message', 'That username is already added.');
                res.redirect('/admin/users');
            } else {
                //res.send('data was good');
                const newUser = new User({
                    username: req.body.username,
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

router.get('/edit/:id', (req, res) => {
    User.findOne({
        _id: req.params.id
    }).then(user => {
        Role.find({}).then(roles => {
            res.render('admin/users/edit', {
                user: user,
                roles: roles
            });
        });
    });


});


router.put('/edit/:id', (req, res) => {
    //console.log(req.params.id);
    User.findOne({
        _id: req.params.id
    }).then(user => {
        user.username = req.body.username;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.email = req.body.email;
        user.role = req.body.role;
        user.save().then(updatedUser => {
            req.flash('success_message', 'User was successfully updated!');
            res.redirect('/admin/users');
        }).catch(error => {
            console.log('could not save edited user! [' + error + ']');
        });

    }).catch(error => {
        console.log('could not find id: ' + req.params.id);
    });
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