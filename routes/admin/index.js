const express = require('express');
const router = express.Router();

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
});


router.get('/', (req, res)=>{

    console.log('Your in admin page.');
    res.render('admin/coming');

});


module.exports = router;