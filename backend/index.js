if (process.env.NODE_ENV !== "production"){
    require('dotenv').config({path: '../.env'});
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const reviews = require('./routers/reviews');
const campgrounds = require('./routers/campgrounds');
const users = require('./routers/users');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const ExpressErrors = require('./utils/ExpressErrors');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
})); 
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected");
});


const sessionConfig = {
    secret: 'thisshouldbebetter',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use(morgan('tiny'));

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
app.use('/users', users);



app.use((req, res, next) => {
    next(new ExpressErrors('Page not found', 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong'} = err;
    res.status(statusCode).json({message});
})


app.listen(3000, () =>{
    console.log("App is listening on port 3000");
})