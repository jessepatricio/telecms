const express = require('express');
const router = express.Router();
const Reinstatement = require('../../models/Reinstatement');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Reinstatement.find({}).then(reinstatements => {
        //console.log('Displaying all roles.');
        res.render('admin/reinstatements', {
            reinstatements: reinstatements
        });
    });

});

router.get('/create', (req, res) => {

    res.render('admin/reinstatements/create');

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
        const newReinstatement = new Reinstatement({
            cabinet: req.body.cabinet,
            streetno: req.body.streetno,
            streetname: req.body.streetname,
            length: req.body.length,
            width: req.body.width,
            file: req.body.file
        });

        newCabinet.save().then(savedCabinet => {
            req.flash('success_message', 'Reinstatement record successfully added!');
            res.redirect('/admin/reinstatemets');
        });
    }
});

router.get('/edit/:id', (req, res) => {
    Reinstatement.findOne({
        _id: req.params.id
    }).then(reinstatement => {
        res.render('admin/cabinets/edit', {
            reinstatement: reinstatement
        });
    });
});

router.put('/edit/:id', (req, res) => {
    //console.log(req.params.id);
    Reinstatement.findOne({
        _id: req.params.id
    }).then(reinstatement => {

        reinstatement.cabinet = req.body.cabinet,
            reinstatement.streetno = req.body.streetno,
            reinstatement.streetname = req.body.streetname,
            reinstatement.length = req.body.length,
            reinstatement.width = req.body.width,
            reinstatement.file = req.body.file
        reinstatement.save().then(updatedReinstatement => {
            req.flash('success_message', 'Reinstatement was successfully updated!');
            res.redirect('/admin/reinstatement');
        }).catch(error => {
            console.log('could not save edited reinstatement! [' + error + ']');
        });

    }).catch(error => {
        console.log('could not find id: ' + req.params.id);
    });
});

router.delete('/:id', (req, res) => {

    //remove record 
    Reinstatement.findOne({
            _id: req.params.id
        })
        .then(reinstatement => {
            reinstatement.remove().then(reinstatementRemoved => {
                req.flash('success_message', 'Reinstatement record was successfully deleted!');
                res.redirect('/admin/reinstatement');
            });
        });

});


module.exports = router;