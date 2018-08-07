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

                res.render('admin/reports', {
                    jobdates: sortArray(jobdates),
                    jobs: jobs
                });

            }).catch(error => {
                res.send("error sorting report!");
            });

        }).catch(error => {
            res.send("error displaying report!");
        });
});



router.post("/filter", (req, res) => {


    if (!req.body.dateFilter) {
        res.redirect("reports");
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
                    res.render('admin/reports', {
                        jobs: jobs,
                        jobdates: sortArray(jobdates),
                        mydate: req.body.dateFilter
                    });
                });
            });
    }
});

function sortArray(jobdates) {


    return jobdates.sort(function (a, b) {
        a = a.split('/').reverse().join('');
        b = b.split('/').reverse().join('');
        return a > b ? 1 : a < b ? -1 : 0;
    }).reverse();

}


module.exports = router;