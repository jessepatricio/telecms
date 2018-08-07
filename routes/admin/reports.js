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
                jobdates = jobdates.sort((s1, s2) => {

                    var sdate1 = s1.split('/');
                    var sdate2 = s2.split('/');
                    var date1 = s1[1] + '/' + s1[0] + '/' + s1[2];
                    var date2 = s2[1] + '/' + s2[0] + '/' + s2[2];
                    if (Date.parse(date1) > Date.parse(date2)) return 1;
                    else if (Date.parse(date1) < Date.parse(date2)) return -1;
                    else return 0;


                });
                //console.log(jobdates);
                res.render('admin/reports', {
                    jobdates: jobdates,
                    jobs: jobs
                });
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