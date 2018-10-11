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

    if (!req.body.name) {
        errors.push({
            message: 'please add name'
        });
    }


    if (errors.length > 0) {

        res.render('admin/tasks/create', {
            errors: errors,
            name: req.body.name
        });

    } else {

        //res.send('data was good');
        const newTask = new Task({
            name: req.body.name
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

        task.name = req.body.name;
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