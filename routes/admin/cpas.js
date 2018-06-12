const express = require('express');
const router = express.Router();
const Cpa = require('../../models/Cpa');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});


router.get('/', (req, res) => {
    const perPage = 10;
    const page = req.query.page || 1;

    // MyModel.find().distinct('_id', function(error, ids) {
    //     // ids is an array of all ObjectIds
    // });

    Cpa.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .then(cpas => {
            Cpa.count().then(cpaCount => {
                Cpa.find({}).distinct('location', (err, cpalocs) => {
                    //console.log(cpalocs);
                    if (err) {
                        req.flash('error_message', 'Error displaying location filter!');
                        res.redirect('/admin/cpas');
                    } else {
                        Cpa.find({}).distinct('mduct1', (err, mducts) => {
                            if (err) {
                                req.flash('error_message', 'Error displaying mduct filter!');
                                res.redirect('/admin/cpas');
                            } else {
                                res.render('admin/cpas', {
                                    cpas: cpas,
                                    mduct1: req.body.mduct1,
                                    mducts: mducts,
                                    location: req.body.location,
                                    cpalocs: cpalocs,
                                    current: parseInt(page),
                                    pages: Math.ceil(cpaCount / perPage)
                                });
                            }
                        });
                    }
                });
            });
        });
});

router.get('/create', (req, res) => {
    Cpa.find({}).then(cpas => {
        res.render('admin/cpas/create', {
            cpas: cpas
        });
    });
});

router.post('/create', (req, res) => {

    let errors = [];
    if (errors.length > 0) {

        res.render('admin/cpas/create', {
            errors: errors,
            location: req.body.location,
            abffpid: req.body.abffpid,
            mduct1: req.body.mduct1,
            mduct2: req.body.mduct2,
            way26tube: req.body.way26tube,
            way10tube: req.body.way10tube,
            way12tube: req.body.way12tube,
            way7tube: req.body.way7tube,
            way4tube: req.body.way4tube,
            streetnumber: req.body.streetnumber,
            streetname: req.body.streetname,
            remarks: req.body.remarks,
            status: req.body.status
        });

    } else {

        //res.send('data was good');
        const newCPA = new Cpa({
            location: req.body.location,
            abffpid: req.body.abffpid,
            mduct1: req.body.mduct1,
            mduct2: req.body.mduct2,
            way26tube: req.body.way26tube,
            way10tube: req.body.way10tube,
            way12tube: req.body.way12tube,
            way7tube: req.body.way7tube,
            way4tube: req.body.way4tube,
            streetnumber: req.body.streetnumber,
            streetname: req.body.streetname,
            remarks: req.body.remarks,
            status: req.body.status
        });

        newCPA.save().then(savedCpa => {
            req.flash('success_message', 'CPA successfully added!');
            res.redirect('/admin/cpas');
        });


    }
});

router.get('/edit/:id', (req, res) => {
    Cpa.findOne({
        _id: req.params.id
    }).then(cpa => {
        res.render('admin/cpas/edit', {
            cpa: cpa
        });
    });
});

router.put('/edit/:id', (req, res) => {
    //console.log(req.params.id);
    Cpa.findOne({
        _id: req.params.id
    }).then(cpa => {
        cpa.location = req.body.location,
            cpa.abffpid = req.body.abffpid,
            cpa.mduct1 = req.body.mduct1,
            cpa.mduct2 = req.body.mduct2,
            cpa.way26tube = req.body.way26tube,
            cpa.way10tube = req.body.way10tube,
            cpa.way12tube = req.body.way12tube,
            cpa.way7tube = req.body.way7tube,
            cpa.way4tube = req.body.way4tube,
            cpa.streetnumber = req.body.streetnumber,
            cpa.streetname = req.body.streetname,
            cpa.remarks = req.body.remarks,
            cpa.status = req.body.status
        cpa.save().then(updatedCpa => {
            req.flash('success_message', 'CPA was successfully updated!');
            res.redirect('/admin/cpas');
        }).catch(error => {
            console.log('could not save edited CPA! [' + error + ']');
        });

    }).catch(error => {
        console.log('could not find id: ' + req.params.id);
    });
});

router.delete('/:id', (req, res) => {

    //remove record 
    Cpa.findOne({
            _id: req.params.id
        })
        .then(cpa => {
            cpa.remove().then(cpaRemoved => {
                req.flash('success_message', 'CPA was successfully deleted!');
                res.redirect('/admin/cpas');
            });
        });



});


router.post('/search_cpa', (req, res) => {
    const perPage = 10;
    const page = req.query.page || 1;

    Cpa.find({
        location: req.body.location,
        mduct1: req.body.mduct1
    }).then(cpas => {
        Cpa.count({
            location: req.body.location,
            mduct1: req.body.mduct1
        }).then(cpaCount => {
            // console.log(cpaCount);
            Cpa.find({}).distinct('location', (err, cpalocs) => {
                if (err) {
                    req.flash('error_message', 'Filter unsuccessful!');
                    res.redirect('/admin/cpas');
                } else {
                    Cpa.find({}).distinct('mduct1', (err, mducts) => {
                        if (err) {
                            req.flash('error_message', 'Filter unsuccessful!');
                            res.redirect('/admin/cpas/index');
                        } else {
                            res.render('admin/cpas', {
                                location: req.body.location,
                                mduct1: req.body.mduct1,
                                cpalocs: cpalocs,
                                mducts: mducts,
                                cpas: cpas,
                                current: parseInt(page),
                                pages: Math.ceil(cpaCount / perPage)
                            });
                        }
                    });
                }
            });
        })
    }).catch(error => {
        req.flash('error_message', 'record not found!');
        res.redirect('admin/cpas/index');
    });;
});


module.exports = router;