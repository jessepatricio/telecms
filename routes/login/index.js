const express = require('express');
const router = express.Router();

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'login';
    next();
});


router.get('/', (req, res) => {

    //console.log('congratualations on your new node.js app');

    res.render('login/index');

});

router.post('/login', (req, res) => {

    console.log('redirecting to dashboard');
    res.redirect('admin');

});

module.exports = router;