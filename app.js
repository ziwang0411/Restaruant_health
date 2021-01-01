if (process.env.NODE_ENV !=='production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/review');
const { isLoggedIn } = require('./middleware');
const { render } = require('ejs');
// const Joi = require('joi')
//for error handling

mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); //parse the req.body
app.use(methodOverride('_method')); //on every single request, use the function(methodoverride)
const sessionConfig = {
    secret: 'SECRRRRRRRRRRRRRREEEEEEEEEEEEETTTTTTTTTTTT',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => { //middleware that runs everytime there is a request
    //res.locals can pass info directly to the file to be rendered
    // console.log(req.user);
    // console.log(req.session);
    res.locals.currentUser = req.user; //used in navbar.ejs
    res.locals.success = req.flash('success'); //show in boilerplate.ejs
    res.locals.error = req.flash('error');
    next();
})


// app.get('/fakeUser', async(req, res) => {
//     const user = new User({email:'ziwang@gmail.com', username: 'ziwang'});
//     const newUser = await User.register(user, 'monkey');
//     res.send(newUser);
// })

//router
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('home');
})
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})
//error handling
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', { err });
})
//listen
app.listen(3000, () => {
    console.log("Serving on Port 3000")
})