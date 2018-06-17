const express = require('express');
const router = express.Router();
const Cpa = require('../../models/Cpa');
const Job = require('../../models/Job');
//const bcrypt = require('bcryptjs');
//const passport = require('passport');
//const LocalStrategy = require('passport-local').Strategy;
const {
    userAuthenticated
} = require('../../helpers/authentication');
//userAuthenticated
router.all('/*', userAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});


router.get('/', (req, res) => {

    //console.log('Your in admin page.');

    Cpa.find({}).distinct('abffpid', (err, cpalocs) => {

        let abffpid = (!req.body.abffpid) ? cpalocs[0] : req.body.abffpid;

        const promises = [

            Job.find({
                'status': 'completed'
            }).count().exec(),
            Job.find({
                'status': 'incomplete'
            }).count().exec(),
            Cpa.find({
                'abffpid': abffpid,
                'status': 'Not tested'
            }).count().exec(),
            Cpa.find({
                'abffpid': abffpid,
                'status': 'Ok'
            }).count().exec(),
            Cpa.find({
                'abffpid': abffpid,
                'status': 'Faulty'
            }).count().exec()


        ];

        Promise.all(promises).then(([completeCount, incompleteCount, pending, oks, faults]) => {

            Cpa.find({
                abffpid: req.body.abffpid
            }).then(recs => {
                res.render('admin/coming', {
                    abffpid: req.body.abffpid,
                    cpalocs: cpalocs,
                    completeCount: completeCount,
                    incompleteCount: incompleteCount,
                    pending,
                    oks,
                    faults
                });

            });
        });
    });



});




module.exports = router;