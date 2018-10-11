const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Task = require('../../models/Task');
//const Plan = require('../../models/Plan');
const Job = require('../../models/Job');
const Cabinet = require('../../models/Cabinet');
const {
    formatDate
} = require('../../helpers/admin-helpers');

const Nexmo = require('nexmo');
const {
    isEmpty,
    uploadDir
} = require('../../helpers/upload-helpers');
const fs = require('fs');

const axios = require('axios');

//set s3 variables
const S3_BUCKET = process.env.S3_BUCKET || 'telecms-static-files';
const AWS_KEYID = process.env.AWS_ACCESS_KEY_ID || 'AKIAJKP3VF7JNE5DKWBQ';
const AWS_SECRET = process.env.AWS_SECRET_ACCESS_KEY || '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';

//s3 bucket name
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: AWS_KEYID,
    secretAccessKey: AWS_SECRET,
    region: 'us-east-2'
});

//notification by sms config vars
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
    Job
        .find({})
        .sort({
            date: -1
        })
        .populate('user', 'firstname')
        .populate('addedby', 'firstname')
        .populate('modifiedby', 'firstname')
        .populate('task', 'name')
        .populate('cabinet', 'name')
        .then(jobs => {

            //console.log(jobs);
            res.render('admin/jobs', {
                jobs: jobs
            });

        });
});

router.get('/create', (req, res) => {
    Job
        .find({})
        .then(jobs => {
            Cabinet
                .find({})
                .then(cabinets => {
                    Task
                        .find({})
                        .then(tasks => {
                            User
                                .find({})
                                .then(users => {
                                    res.render('admin/jobs/create', {
                                        jobs: jobs,
                                        cabinets: cabinets,
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
    let file = null;
    let filename = '';
    let errors = [];

    //has file to upload
    if (!isEmpty(req.files)) {

        //console.log(req.files.file);
        file = req.files.file;

        filename = Date.now() + '-' + file.name;

        //get presigned key to s3
        const uploadConfig = s3.getSignedUrl('putObject', {
            Bucket: S3_BUCKET,
            ContentType: 'image/jpeg',
            Key: filename

        });

        //console.log(uploadConfig); upload file to bucket s3
        if (uploadConfig) {

            axios
                .put(uploadConfig, file.data, {
                    headers: {
                        'Content-Type': file.mimetype
                    }
                })
                .then(response => { //
                    //console.log(response.data.url); console.log(response.data.explanation);
                })
                .catch(error => {
                    console.log('error uploading file');
                });
        } else {
            errors.push({
                message: 'signed url denied!'
            });
        }

        // file.mv(dirUploads + filename, (err) => {     if (err) throw err; // });
    }

    //console.log(filename);

    if (errors.length > 0) {

        res.render('admin/jobs/create', {
            errors: errors,
            cabinet: req.body.cabinet,
            task: req.body.task,
            user: req.body.user,
            remarks: req.body.remarks,
            status: req.body.status,
            lno: req.body.lno,
            withDig: req.body.withDig,
            withBackfill: req.body.withBackfill,
            streetno: req.body.streetno,
            streetname: req.body.streetname,
            file: filename
        });

    } else {

        //res.send('data was good');
        const newJob = new Job({
            cabinet: req.body.cabinet,
            task: req.body.task,
            user: req.body.user,
            remarks: req.body.remarks,
            file: filename,
            status: req.body.status,
            lno: req.body.lno,
            withDig: (req.body.withDig == 'on') ? true : false,
            withBackfill: (req.body.withBackfill == 'on') ? true : false,
            streetno: req.body.streetno,
            streetname: req.body.streetname,
            jobdate: formatDate(Date.now(), "DD/MM/YYYY"),
            addedby: req.user,
            modifiedby: req.user
        });

        newJob
            .save()
            .then(savedJob => {
                req.flash('success_message', 'Job successfully added!');

                if (req.body.allowNotify === 'on') {

                    //send sms
                    Job
                        .findById({
                            _id: savedJob.id
                        })
                        .populate('user', 'firstname')
                        .populate('task', 'name')
                        .populate('cabinet', 'cabinet')
                        .then(job => {

                            let message = job.cabinet.name + '|' + job.lno + '|' + job.task.name + '|' + job.user.firstname + '|' + job.date + '|' + job.status;

                            nexmo
                                .message
                                .sendSms(YOUR_VIRTUAL_NUMBER, jesse_phone, message, (err, responseData) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.dir(responseData);
                                        console.log('notification sent.');
                                    }
                                });

                        });
                } else {
                    console.log('no notification sent.');
                }

                res.redirect('/admin/jobs');
            });

    }
});

router.get('/edit/:id', (req, res) => {
    Job
        .findOne({
            _id: req.params.id
        })
        .then(job => {
            Cabinet
                .find({})
                .then(cabinets => {
                    Task
                        .find({})
                        .then(tasks => {
                            User
                                .find({})
                                .then(users => {
                                    //console.log(job);
                                    res.render('admin/jobs/edit', {
                                        job: job,
                                        cabinets: cabinets,
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
    let file = null;
    let filename = '';
    let errors = [];

    //has file to upload
    if (!isEmpty(req.files)) {

        //console.log(req.files.file);
        file = req.files.file;

        filename = Date.now() + '-' + file.name;

        //get presigned key to s3
        const uploadConfig = s3.getSignedUrl('putObject', {
            Bucket: S3_BUCKET,
            ContentType: 'image/jpeg',
            Key: filename

        });

        //console.log(uploadConfig); upload file to bucket s3
        if (uploadConfig) {

            axios
                .put(uploadConfig, file.data, {
                    headers: {
                        'Content-Type': file.mimetype
                    }
                })
                .then(response => { //
                    //console.log(response.data.url); console.log(response.data.explanation);
                })
                .catch(error => {
                    console.log('error uploading file');
                });
        } else {
            errors.push({
                message: 'signed url denied!'
            });
        }



    }

    Job
        .findOne({
            _id: req.params.id
        })
        .then(job => {

            job.cabinet = req.body.cabinet;
            job.task = req.body.task;
            job.user = req.body.user;
            job.remarks = req.body.remarks;
            job.file = filename;
            job.lno = req.body.lno;
            job.withDig = (req.body.withDig == 'on') ? true : false;
            job.withBackfill = (req.body.withBackfill == 'on') ? true : false;
            job.status = req.body.status;
            job.streetno = req.body.streetno;
            job.streetname = req.body.streetname;
            job.jobdate = formatDate(Date.now(), "DD/MM/YYYY");
            job.date = Date.now();
            job.modifiedby = req.user;
            job
                .save()
                .then(updatedJob => {
                    req.flash('success_message', 'Job was successfully updated!');

                    if (req.body.allowNotify === 'on') {
                        //send sms
                        Job
                            .findById({
                                _id: updatedJob.id
                            })
                            .lean()
                            .populate('user', 'firstname')
                            .populate('task', 'description')
                            .populate('cabinet', 'cabinet')
                            .then(job => {

                                let message = job.cabinet.name + '|' + job.lno + '|' + job.task.name + '|' + job.user.firstname + '|' + job.date + '|' + job.status;

                                nexmo
                                    .message
                                    .sendSms(YOUR_VIRTUAL_NUMBER, jesse_phone, message, (err, responseData) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.dir(responseData);
                                            console.log('notification sent.');
                                        }
                                    });

                            });
                    } else {
                        console.log('no notification sent.');
                    }

                    res.redirect('/admin/jobs');

                })
                .catch(error => {
                    console.log('could not save edited job! [' + error + ']');
                });

        })
        .catch(error => {
            console.log('could not find id: ' + req.params.id);
        });
});

router.delete('/:id', (req, res) => {

    //remove record
    Job
        .findOne({
            _id: req.params.id
        })
        .then(job => {
            //console.log(uploadDir + job.file);
            if (job.file) {
                fs.unlink(uploadDir + job.file, (err) => {});
            }

            job
                .remove()
                .then(jobRemoved => {
                    req.flash('success_message', 'Job was successfully deleted!');
                    res.redirect('/admin/jobs');
                });
        });

});

//upload image file route
router.get('/api/upload', (req, res) => {

    const filename = req.query.filename;

    s3.getSignedUrl('putObject', {
        Bucket: S3_BUCKET,
        ContentType: 'jpeg',
        Key: filename
    }, (err, url) => res.send({
        filename,
        url
    }));

});

module.exports = router;