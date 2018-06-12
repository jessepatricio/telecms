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

router.post("/filter", (req, res) => {
    console.log(req.body.dateFilter);
    //res.render('admin/reports');
    if (req.body.dateFilter != '--all--') {
        var parts = req.body.dateFilter.split('/');
        // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
        // January - 0, February - 1, etc.
        var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
        console.log("trans: " + mydate);
        Job.find({
                "date": {
                    $gte: mydate,
                    $lt: moment(mydate).add(1, 'days')
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
                Job.aggregate(
                        [{
                            $group: {
                                _id: {
                                    year: {
                                        $year: "$requests.rstTimeStamp"
                                    },
                                    month: {
                                        $month: "$requests.rstTimeStamp"
                                    },
                                    day: {
                                        $dayOfMonth: "$requests.rstTimeStamp"
                                    }
                                }
                            }

                        }])
                    .then(jobdates => {
                        res.render('admin/reports', {
                            jobs: jobs,
                            jobdates: jobdates,
                            mydate: req.body.dateFilter
                        });
                    });
            });
    } else {
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
                Job.aggregate(
                        [{
                            $group: {
                                _id: {
                                    year: {
                                        $year: "$requests.rstTimeStamp"
                                    },
                                    month: {
                                        $month: "$requests.rstTimeStamp"
                                    },
                                    day: {
                                        $dayOfMonth: "$requests.rstTimeStamp"
                                    }
                                }
                            }

                        }])
                    .then(jobdates => {
                        res.render('admin/reports', {
                            jobs: jobs,
                            jobdates: jobdates
                        });
                    });
            });
    }

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
            Job.aggregate(
                    [{
                        $group: {
                            _id: {
                                year: {
                                    $year: "$requests.rstTimeStamp"
                                },
                                month: {
                                    $month: "$requests.rstTimeStamp"
                                },
                                day: {
                                    $dayOfMonth: "$requests.rstTimeStamp"
                                }
                            }
                        }

                    }])
                .then(jobdates => {
                    res.render('admin/reports', {
                        jobs: jobs,
                        jobdates: jobdates
                    });
                });
        });

});


module.exports = router;