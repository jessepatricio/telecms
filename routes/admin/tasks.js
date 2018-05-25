const express = require('express');
const router = express.Router();
const Task = require('../../models/Task');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    const perPage = 10;
    const page = req.query.page || 1;

    Task.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .then(tasks => {

            Task.count().then(taskCount => {
                res.render('admin/tasks', {
                    tasks: tasks,
                    current: parseInt(page),
                    pages: Math.ceil(taskCount / perPage)
                });

            });
        });

});

router.get('/create', (req, res) => {

    res.render('admin/tasks/create');

});

router.post('/create', (req, res) => {

    let errors = [];

    //console.log(req.body.code);

    if (!req.body.code) {
        errors.push({
            message: 'please enter your code'
        });
    }

    if (!req.body.description) {
        errors.push({
            message: 'please add description'
        });
    }


    if (errors.length > 0) {

        res.render('admin/tasks/create', {
            errors: errors,
            code: req.body.code,
            description: req.body.description
        });

    } else {

        //res.send('data was good');
        const newTask = new Task({
            code: req.body.code,
            description: req.body.description
        });

        newTask.save().then(savedTask => {
            req.flash('success_message', 'Task successfully added!');
            res.redirect('/admin/tasks/create');
        });
    }
});

module.exports = router;