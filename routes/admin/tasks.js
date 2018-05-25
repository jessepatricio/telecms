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

router.get('/edit/:id', (req, res) => {
    Task.findOne({
        _id: req.params.id
    }).then(task => {
        res.render('admin/tasks/edit', {
            task: task
        });
    });
});

router.put('/edit/:id', (req, res) => {
    //console.log(req.params.id);
    Task.findOne({
        _id: req.params.id
    }).then(task => {

        task.code = req.body.code;
        task.description = req.body.description;
        task.save().then(updatedTask => {
            req.flash('success_message', 'Task was successfully updated!');
            res.redirect('/admin/tasks');
        }).catch(error => {
            console.log('could not save edited task! [' + error + ']');
        });

    }).catch(error => {
        console.log('could not find id: ' + req.params.id);
    });
});

router.delete('/:id', (req, res) => {

    //remove record 
    Task.findOne({
            _id: req.params.id
        })
        .then(task => {
            task.remove().then(taskRemoved => {
                req.flash('success_message', 'Task was successfully deleted!');
                res.redirect('/admin/tasks');
            });
        });

});



module.exports = router;