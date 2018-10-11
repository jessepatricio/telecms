const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const {
    mongoDbURL
} = require('./config/database');
const passport = require('passport');
const upload = require('express-fileupload');

mongoose.Promise = global.Promise;
console.log('Connecting to ' + mongoDbURL);
mongoose.connect(mongoDbURL, {
    useNewUrlParser: true
}).then((db) => {
    console.log('MONGO connected');
}).catch(error => console.log(`ERROR CONNECTING TO MONGODB: ` + error));
mongoose.set('useCreateIndex', true);

//using static (enable use of css/js/etc)
app.use(express.static(path.join(__dirname, 'public')));

//use helpers function
const {
    select,
    formatDate,
    paginate
} = require('./helpers/admin-helpers');

//set view engine
app.engine('handlebars', exphbs({
    defaultLayout: 'admin',
    helpers: {
        select: select,
        formatDate: formatDate,
        paginate: paginate
    }
}));
app.set('view engine', 'handlebars');

//upload middleware
app.use(upload());

//body parser
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//method override
app.use(methodOverride('_method'));

//load routes
const login = require('./routes/login/index');
const admin = require('./routes/admin/index');
const tasks = require('./routes/admin/tasks');
const users = require('./routes/admin/users');
const roles = require('./routes/admin/roles');
const cabinets = require('./routes/admin/cabinets');
const jobs = require('./routes/admin/jobs');
const reports = require('./routes/admin/reports');
const reinstatements = require('./routes/admin/reinstatements');

//session
app.use(session({
    secret: 'jesse@1974',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());

//local variables using middleware
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.info_message = req.flash('info_message');
    res.locals.error = req.flash('error');
    next();
});

//use routes
app.use('/', login);
app.use('/admin', admin);
app.use('/admin/users', users);
app.use('/admin/tasks', tasks);
app.use('/admin/roles', roles);
app.use('/admin/cabinets', cabinets);
app.use('/admin/jobs', jobs);
app.use('/admin/reports', reports);
app.use('/admin/reinstatements', reinstatements);


const port = process.env.PORT || 8888;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});