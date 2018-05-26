const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Task = require('../../models/Task');
const Plan = require('../../models/Plan');
const Job = require('../../models/Job');
const Location = require('../../models/Location');

var moment = require('moment')

var today = moment().startOf('day')
var tomorrow = moment(today).add(1, 'days')


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});


router.get('/', (req, res) => {
    Job.find({
            "date": {
                $gte: today.toDate(),
                $lt: tomorrow.toDate()
            }
        })
        .populate('user', 'firstname')
        .populate('task', 'description')
        .populate({
            path: 'plan',
            populate: {
                path: 'location'
            }
        })
        .then(jobs => {
            res.render('admin/reports', {
                jobs: jobs,
            });
        });
});


module.exports = router;