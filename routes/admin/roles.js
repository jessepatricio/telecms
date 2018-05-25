const express = require('express');
const router = express.Router();
const Role = require('../../models/Role');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Role.find({}).then(roles => {
        //console.log('Displaying all roles.');
        res.render('admin/roles', {
            roles: roles
        });
    });

});

router.get('/create', (req, res) => {

    res.render('admin/roles/create');

});

router.post('/create', (req, res) => {

    let errors = [];

    console.log(req.body.role);

    if (!req.body.rolename) {
        errors.push({
            message: 'please enter your role'
        });
    }

    if (errors.length > 0) {

        res.render('admin/roles/create', {
            errors: errors,
            role: req.body.rolename,
        });

    } else {

        //res.send('data was good');
        const newRole = new Role({
            rolename: req.body.rolename,
        });

        newRole.save().then(savedRole => {
            req.flash('success_message', 'Role successfully added!');
            res.redirect('/admin/roles');
        });
    }
});

router.get('/edit/:id', (req, res) => {
    Role.findOne({
        _id: req.params.id
    }).then(role => {
        res.render('admin/roles/edit', {
            role: role
        });
    });
});

router.put('/edit/:id', (req, res) => {
    //console.log(req.params.id);
    Role.findOne({
        _id: req.params.id
    }).then(role => {

        role.rolename = req.body.rolename;
        role.save().then(updatedRole => {
            req.flash('success_message', 'Role was successfully updated!');
            res.redirect('/admin/roles');
        }).catch(error => {
            console.log('could not save edited role! [' + error + ']');
        });

    }).catch(error => {
        console.log('could not find id: ' + req.params.id);
    });
});



router.delete('/:id', (req, res) => {

    //remove record 
    Role.findOne({
            _id: req.params.id
        })
        .then(role => {
            role.remove().then(roleRemoved => {
                req.flash('success_message', 'Role was successfully deleted!');
                res.redirect('/admin/roles');
            });
        });

});


module.exports = router;