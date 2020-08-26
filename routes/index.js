const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { forwardAuthenticated } = require('../config/auth');
const passport = require('passport');

//Home Page
router.get('/',(req,res)=>{
    res.render('home');
})


//Login Routes
router.get('/login',forwardAuthenticated,(req,res)=>{
    res.render('login');
})
router.post('/login',(req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/auth/products-view-only',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
});


//Register routes
router.get('/register',forwardAuthenticated,(req,res)=>{
    res.render('register');
})
router.post('/register',(req,res)=>{
    const {name,email,password,passwordconfirm,role} = req.body;
    let errors =[];
    console.log(req.body);
    if (name === '' || email==='' || password==='' || passwordconfirm==='' || role===''){
        errors.push({msg : 'please enter all fields'});
    }
    if (password != passwordconfirm){
        errors.push({msg : 'Passwords do not match'});
    }
    if (password.length < 6){
        errors.push({msg : 'Password must be at least 6 characters'});
    }
    if (errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            passwordconfirm
        });
    }
    else {
        User.findOne({email : email})
        .then((user)=>{
            if (user){
                errors.push({msg : 'Email already exists'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    passwordconfirm
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password,
                    role
                });
                bcrypt.genSalt(10, (err,salt)=>{
                    bcrypt.hash(newUser.password, 10, (err,hash) =>{
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then((user)=>{
                            req.flash(
                                'success_msg',
                                'You are now connected and can Log In'
                            );
                            res.redirect('/login');
                        })
                        .catch((err)=>{
                            console.error(err);
                        })
                    })
                })
            }
        })
        .catch((err)=>{
            console.error(err);
        })
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});

module.exports = router;

/*
const {username,email,password,passwordconfirm} = req.body;
    const newUser = User({
        name : username,
        email : email,
        password : password
    });
    newUser.save()
    .then(()=>{
        console.log(newUser);
    })
    .catch((err)=>{
        console.error(err);
    })
*/ 