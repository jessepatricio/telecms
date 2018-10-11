const express = require('express');
const router = express.Router();
const Cabinet = require('../../models/Cabinet');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Cabinet.find({}).then(cabinets => {
        //console.log('Displaying all roles.');
        res.render('admin/cabinets', {
            cabinets: cabinets
        });
    });

});

router.get('/create', (req, res) => {

    res.render('admin/cabinets/create');

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

        res.render('admin/cabinets/create', {
            errors: errors,
            role: req.body.name,
        });

    } else {

        //res.send('data was good');
        const newCabinet = new Cabinet({
            name: req.body.name,
            dropcount: req.body.dropcount
        });

        newCabinet.save().then(savedCabinet => {
            req.flash('success_message', 'Cabinet successfully added!');
            res.redirect('/admin/cabinets');
        });
    }
});

router.get('/edit/:id', (req, res) => {
    Cabinet.findOne({
        _id: req.params.id
    }).then(cabinet => {
        res.render('admin/cabinets/edit', {
            cabinet: cabinet
        });
    });
});

router.put('/edit/:id', (req, res) => {
    //console.log(req.params.id);
    Cabinet.findOne({
        _id: req.params.id
    }).then(cabinet => {

        cabinet.name = req.body.name;
        cabinet.dropcount = req.body.dropcount;
        cabinet.save().then(updatedCabinet => {
            req.flash('success_message', 'Cabinet was successfully updated!');
            res.redirect('/admin/cabinets');
        }).catch(error => {
            console.log('could not save edited cabinet! [' + error + ']');
        });

    }).catch(error => {
        console.log('could not find id: ' + req.params.id);
    });
});

router.delete('/:id', (req, res) => {

    //remove record 
    Cabinet.findOne({
            _id: req.params.id
        })
        .then(cabinet => {
            cabinet.remove().then(cabinetRemoved => {
                req.flash('success_message', 'Cabinet was successfully deleted!');
                res.redirect('/admin/cabinets');
            });
        });

});


module.exports = router;