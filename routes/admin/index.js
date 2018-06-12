const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Job = require('../../models/Job');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {
    userAuthenticated
} = require('../../helpers/authentication');
//userAuthenticated
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});


router.get('/', (req, res) => {

    //console.log('Your in admin page.');
    const promises = [

        Job.find({
            'status': 'completed'
        }).count().exec(),
        Job.find({
            'status': 'incomplete'
        }).count().exec()


    ];

    Promise.all(promises).then(([completeCount, incompleteCount]) => {

        res.render('admin/coming', {
            completeCount: completeCount,
            incompleteCount: incompleteCount
        });

    });



});




module.exports = router;