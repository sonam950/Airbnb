const express = require('express');
const router = express.Router();
const User = require('../Models/user');
const wrapAsync = require('../utils/wrapasync');
const passport = require('passport');
router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
});

router.post('/signup',wrapAsync( async (req, res) => {
try{
    let {username,email,password}=req.body;
const newUser =new User({email,username});
 const registerUser =await User.register(newUser,password)
 req.login(registerUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Welcome to the app!');
 res.redirect('/listings');
    });
 
}catch (e) {
    req.flash('error', e.message);
    res.redirect('/signup');
}
}))
router.get('/login', (req, res) => {
    res.render('users/login.ejs');
}); 
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, () => {
    req.flash('success', 'Welcome back!');
    res.redirect('/listings');
  });
});
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/listings');
    });
})
module.exports = router;