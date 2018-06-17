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

    Cpa.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .then(cpas => {
            Cpa.count().then(cpaCount => {
                Cpa.find({}).distinct('abffpid', (err, cpalocs) => {
                    //console.log(cpalocs);
                    if (err) {
                        req.flash('error_message', 'Error displaying abffpid filter!');
                        res.redirect('/admin/cpas');
                    } else {
                        res.render('admin/cpas', {
                            cpas: cpas,
                            abffpid: req.body.abffpid,
                            cpalocs: cpalocs,
                            current: parseInt(page),
                            pages: Math.ceil(cpaCount / perPage)
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
    //console.log("Post abffpid: " + req.body.abffpid);
    Cpa.find({
            abffpid: req.body.abffpid
        })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .then(cpas => {
            Cpa.count({
                abffpid: req.body.abffpid
            }).then(cpaCount => {
                // console.log(cpaCount);
                Cpa.find({}).distinct('abffpid', (err, cpalocs) => {
                    if (err) {
                        req.flash('error_message', 'Filter unsuccessful!');
                        res.redirect('/admin/cpas');
                    } else {
                        res.render('admin/cpas', {
                            abffpid: req.body.abffpid,
                            cpalocs: cpalocs,
                            cpas: cpas,
                            current: parseInt(page),
                            pages: Math.ceil(cpaCount / perPage)
                        });
                    }
                });
            })
        }).catch(error => {
            req.flash('error_message', 'record not found!');
            res.redirect('admin/cpas');
        });
});

router.get('/search_cpa', (req, res) => {
    const perPage = 10;
    const page = req.query.page || 1;
    //console.log("Post abffpid: " + req.query.abffpid);
    Cpa.find({
            abffpid: req.query.abffpid
        })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .then(cpas => {
            Cpa.count({
                abffpid: req.query.abffpid
            }).then(cpaCount => {
                // console.log(cpaCount);
                Cpa.find({}).distinct('abffpid', (err, cpalocs) => {
                    if (err) {
                        console.log(err);
                        req.flash('error_message', 'Filter unsuccessful!');
                        res.redirect('/admin/cpas');
                    } else {
                        res.render('admin/cpas', {
                            abffpid: req.query.abffpid,
                            cpalocs: cpalocs,
                            cpas: cpas,
                            current: parseInt(page),
                            pages: Math.ceil(cpaCount / perPage)
                        });
                    }
                });
            });

        }).catch(error => {
            req.flash('error_message', 'record not found!');
            res.redirect('admin/cpas');
        });
});


module.exports = router;