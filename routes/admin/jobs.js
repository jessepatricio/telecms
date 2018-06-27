const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Task = require('../../models/Task');
const Plan = require('../../models/Plan');
const Job = require('../../models/Job');
const Location = require('../../models/Location');
const {
    formatDate
} = require('../../helpers/admin-helpers');

const Nexmo = require('nexmo');
const {
    isEmpty,
    uploadDir
} = require('../../helpers/upload-helpers');
const fs = require('fs');

let API_KEY = '248ebde6';
let API_SECRET = 'b9n4iKmTgFVOV1T5';
let YOUR_VIRTUAL_NUMBER = '64211110738';
let noel_phone = '64223455406';
let phil_phone = '64226195629';
let jesse_phone = '64211110738';

const nexmo = new Nexmo({
    apiKey: API_KEY,
    apiSecret: API_SECRET
});


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});


router.get('/', (req, res) => {
    Job.find({})
        .populate('user', 'firstname')
        .populate('addedby', 'firstname')
        .populate('modifiedby', 'firstname')
        .populate('task', 'description')
        .populate({
            path: 'plan',
            populate: {
                path: 'location'
            }
        })
        .then(jobs => {
            res.render('admin/jobs', {
                jobs: jobs,
            });
        });
});

router.get('/create', (req, res) => {
    Job.find({}).then(jobs => {
        Plan.find({}).then(plans => {
            Task.find({}).then(tasks => {
                User.find({}).then(users => {
                    res.render('admin/jobs/create', {
                        jobs: jobs,
                        plans: plans,
                        tasks: tasks,
                        users: users
                    });
                });
            });
        });
    });
});

router.post('/create', (req, res) => {

    //console.log(req.files);
    let filename = '';

    //has file to upload
    if (!isEmpty(req.files)) {

        let file = req.files.file;
        filename = Date.now() + '-' + file.name;
        let dirUploads = './public/uploads/';

        file.mv(dirUploads + filename, (err) => {

            if (err) throw err;

        });
    }

    //console.log(filename);

    let errors = [];
    if (errors.length > 0) {

        res.render('admin/jobs/create', {
            errors: errors,
            plan: req.body.plan,
            task: req.body.task,
            user: req.body.user,
            comments: req.body.comments,
            status: req.body.status,
            file: filename
        });

    } else {

        //res.send('data was good');
        const newJob = new Job({
            plan: req.body.plan,
            task: req.body.task,
            user: req.body.user,
            comments: req.body.comments,
            file: filename,
            status: req.body.status,
            jobdate: formatDate(Date.now(), "DD/MM/YYYY"),
            addedby: req.user,
            modifiedby: req.user
        });

        newJob.save().then(savedJob => {
            req.flash('success_message', 'Job successfully added!');

            if (req.body.allowNotify === 'on') {

                //send sms
                Job.findById({
                        _id: savedJob.id
                    })
                    .populate('user', 'firstname')
                    .populate('task', 'description')
                    .populate({
                        path: 'plan',
                        populate: {
                            path: 'location'
                        }
                    })
                    .then(job => {

                        let message = job.plan.location.name + '|' + job.plan.lno + '|' + job.task.description +
                            '|' + job.user.firstname + '|' + job.date + '|' + job.status;

                        nexmo.message.sendSms(
                            YOUR_VIRTUAL_NUMBER, jesse_phone, message,
                            (err, responseData) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.dir(responseData);
                                    console.log('notification sent.');
                                }
                            }
                        );

                    });
            } else {
                console.log('no notification sent.');
            }


            res.redirect('/admin/jobs');
        });


    }
});

router.get('/edit/:id', (req, res) => {
    Job.findOne({
        _id: req.params.id
    }).then(job => {
        Plan.find({}).then(plans => {
            Task.find({}).then(tasks => {
                User.find({}).then(users => {
                    res.render('admin/jobs/edit', {
                        job: job,
                        plans: plans,
                        tasks: tasks,
                        users: users
                    });
                });
            });
        });
    });
});


router.put('/edit/:id', (req, res) => {


    //console.log(req.files);
    let filename = '';

    //has file to upload
    if (!isEmpty(req.files)) {

        let file = req.files.file;
        filename = Date.now() + '-' + file.name;
        let dirUploads = './public/uploads/';

        file.mv(dirUploads + filename, (err) => {

            if (err) throw err;

        });
    }

    Job.findOne({
        _id: req.params.id
    }).then(job => {

        job.plan = req.body.plan;
        job.task = req.body.task;
        job.user = req.body.user;
        job.comments = req.body.comments;
        job.file = req.body.filename;
        job.status = req.body.status;
        job.jobdate = formatDate(Date.now(), "DD/MM/YYYY");
        job.date = Date.now();
        job.modifiedby = req.user;
        job.save().then(updatedJob => {
            req.flash('success_message', 'Job was successfully updated!');

            if (req.body.allowNotify === 'on') {
                //send sms
                Job.findById({
                        _id: updatedJob.id
                    })
                    .lean()
                    .populate('user', 'firstname')
                    .populate('task', 'description')
                    .populate({
                        path: 'plan',
                        populate: {
                            path: 'location'
                        }
                    })
                    .then(job => {

                        let message = job.plan.lno + '|' + job.task.description +
                            '|' + job.user.firstname + '|' + job.date + '|' + job.status;

                        nexmo.message.sendSms(
                            YOUR_VIRTUAL_NUMBER, jesse_phone, message,
                            (err, responseData) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.dir(responseData);
                                    console.log('notification sent.');
                                }
                            }
                        );


                    });
            } else {
                console.log('no notification sent.');
            }

            res.redirect('/admin/jobs');

        }).catch(error => {
            console.log('could not save edited job! [' + error + ']');
        });

    }).catch(error => {
        console.log('could not find id: ' + req.params.id);
    });
});


router.delete('/:id', (req, res) => {

    //remove record 
    Job.findOne({
            _id: req.params.id
        })
        .then(job => {
            console.log(uploadDir + job.file);
            if (job.file) {
                fs.unlink(uploadDir + job.file, (err) => {

                });
            }

            job.remove().then(jobRemoved => {
                req.flash('success_message', 'Job was successfully deleted!');
                res.redirect('/admin/jobs');
            });
        });

});

module.exports = router;