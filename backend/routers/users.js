const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const ExpressErrors = require('../utils/ExpressErrors');

router.post('/register', async (req, res, next) => {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    res.json(registeredUser);
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ message: info.message || 'Login failed' });
        }
        req.login(user, (err) => {
            if (err) return next(err);
            res.json({ 
                message: 'Welcome back!', 
                user: user 
            });
        });
    })(req, res, next);
})

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.json({ message: 'Logged out successfully!' });
    });
})

router.get('/current', (req, res) => {
    if (req.user) {
        res.json({ user: req.user });
    } else {
        res.json({ user: null });
    }
})

module.exports = router;