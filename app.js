const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');


//using static (enable use of css/js/etc)
app.use(express.static(path.join(__dirname, 'public')));

//set view engine
app.engine('handlebars', exphbs({
    defaultLayout: 'admin'
}));
app.set('view engine', 'handlebars');


//load routes
const login = require('./routes/login/index');
const admin = require('./routes/admin/index');

//use routes
app.use('/', login);
app.use('/admin', admin);



const port = process.env.PORT || 8888;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});