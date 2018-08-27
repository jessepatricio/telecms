const express = require('express');
const router = express.Router();
const Plan = require('../../models/Plan');
const Location = require('../../models/Location');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    const perPage = 10;
    const page = req.query.page || 1;

    Plan.find({})
        .sort({
            date: -1
        })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .populate('location')
        .then(plans => {

            Plan.count().then(planCount => {
                res.render('admin/plans', {
                    plans: plans,
                    current: parseInt(page),
                    pages: Math.ceil(planCount / perPage)
                });


            });
        });

});

router.get('/create', (req, res) => {
    Location.find({}).then(locations => {
        res.render('admin/plans/create', {
            locations: locations
        });
    });
});

router.post('/create', (req, res) => {

    let errors = [];

    //console.log(req.body.code);

    if (!req.body.lno) {
        errors.push({
            message: 'please enter lno.'
        });
    }

    if (!req.body.sheetno) {
        errors.push({
            message: 'please enter sheet no.'
        });
    }

    if (!req.body.instruction) {
        errors.push({
            message: 'please enter instruction'
        });
    }


    if (errors.length > 0) {

        res.render('admin/plans/create', {
            errors: errors,
            lno: req.body.lno,
            sheetno: req.body.sheetno,
            location: req.body.location,
            instruction: req.body.instruction,
            code: req.body.code,
            streetno: req.body.streetno,
            streetname: req.body.streetname
        });

    } else {

        //res.send('data was good');
        const newPlan = new Plan({
            lno: req.body.lno,
            sheetno: req.body.sheetno,
            location: req.body.location,
            instruction: req.body.instruction,
            code: req.body.code,
            streetno: req.body.streetno,
            streetname: req.body.streetname
        });

        newPlan.save().then(savedPlan => {
            req.flash('success_message', 'Plan successfully added!');
            res.redirect('/admin/plans/create');
        });
    }
});

router.get('/edit/:id', (req, res) => {
    Plan.findOne({
        _id: req.params.id
    }).then(plan => {
        Location.find({}).then(locations => {
            res.render('admin/plans/edit', {
                plan: plan,
                locations: locations
            });
        });
    });
});

router.put('/edit/:id', (req, res) => {
    //console.log(req.params.id);
    Plan.findOne({
        _id: req.params.id
    }).then(plan => {

        plan.lno = req.body.lno;
        plan.sheetno = req.body.sheetno;
        plan.instruction = req.body.instruction;
        plan.location = req.body.location;
        plan.code = req.body.code;
        plan.streetno = req.body.streetno;
        plan.streetname = req.body.streetname;
        plan.save().then(updatedPlan => {
            req.flash('success_message', 'Plan was successfully updated!');
            res.redirect('/admin/plans');
        }).catch(error => {
            console.log('could not save edited plan! [' + error + ']');
        });

    }).catch(error => {
        console.log('could not find id: ' + req.params.id);
    });
});

router.delete('/:id', (req, res) => {

    //remove record 
    Plan.findOne({
            _id: req.params.id
        })
        .then(plan => {
            plan.remove().then(planRemoved => {
                req.flash('success_message', 'Plan was successfully deleted!');
                res.redirect('/admin/plans');
            });
        });

});



module.exports = router;