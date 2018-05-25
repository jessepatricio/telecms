const express = require('express');
const router = express.Router();
const Location = require('../../models/Location');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Location.find({}).then(locations => {
        //console.log('Displaying all roles.');
        res.render('admin/locations', {
            locations: locations
        });
    });

});

router.get('/create', (req, res) => {

    res.render('admin/locations/create');

});

router.post('/create', (req, res) => {

    let errors = [];

    //console.log(req.body.name);

    if (!req.body.name) {
        errors.push({
            message: 'please enter location name!'
        });
    }

    if (errors.length > 0) {

        res.render('admin/locations/create', {
            errors: errors,
            role: req.body.name,
        });

    } else {

        //res.send('data was good');
        const newLocation = new Location({
            name: req.body.name
        });

        newLocation.save().then(savedLocation => {
            req.flash('success_message', 'Location successfully added!');
            res.redirect('/admin/locations');
        });
    }
});

router.get('/edit/:id', (req, res) => {
    Location.findOne({
        _id: req.params.id
    }).then(location => {
        res.render('admin/locations/edit', {
            location: location
        });
    });
});

router.put('/edit/:id', (req, res) => {
    //console.log(req.params.id);
    Location.findOne({
        _id: req.params.id
    }).then(location => {

        location.name = req.body.name;
        location.save().then(updatedLocation => {
            req.flash('success_message', 'Location was successfully updated!');
            res.redirect('/admin/locations');
        }).catch(error => {
            console.log('could not save edited location! [' + error + ']');
        });

    }).catch(error => {
        console.log('could not find id: ' + req.params.id);
    });
});

router.delete('/:id', (req, res) => {

    //remove record 
    Location.findOne({
            _id: req.params.id
        })
        .then(location => {
            location.remove().then(locationRemoved => {
                req.flash('success_message', 'Location was successfully deleted!');
                res.redirect('/admin/locations');
            });
        });

});


module.exports = router;