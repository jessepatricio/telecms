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

            Job.distinct("jobdate").then(jobdates => {
                //console.log(jobdates);
                jobdates = jobdates.sort();
                //console.log(jobdates);
                res.render('admin/reports', {
                    jobdates: jobdates.reverse(),
                    jobs: jobs
                });
            });


        }).catch(error => {
            req.flash('error_message', 'error displaying jobs!');
            res.redirect('admin/reports');
        });

});

router.post("/filter", (req, res) => {


    if (!req.body.dateFilter) {
        res.redirect("/admin/reports");
    } else {


        let _date = (req.body.dateFilter) ? req.body.dateFilter : '';

        var query = {
            jobdate: _date
        };
        Job.find(query)
            .populate('user', 'firstname')
            .populate('task', 'description')
            .populate({
                path: 'plan',
                populate: {
                    path: 'location'
                }
            })
            .then(jobs => {
                Job.distinct("jobdate").then(jobdates => {
                    jobdates = jobdates.sort();
                    res.render('admin/reports', {
                        jobs: jobs,
                        jobdates: jobdates.reverse(),
                        mydate: req.body.dateFilter
                    });
                });
            });
    }
});


module.exports = router;