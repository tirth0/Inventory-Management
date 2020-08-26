const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

//Load User model
const User = require('../models/User');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField : 'email'}, (email,password,done)=>{
            //Matching User
            User.findOne({
                email : email
            }).then(user=>{
                if (!user){
                    return done(null,false, {message : 'Email not registered'});

                }

                //Match Password
                bcrypt.compare(password, user.password, (err, isMatch) =>{
                    if (err) throw err;
                    if (isMatch) {
                        return done(null,user);
                    } else {
                        return done(null, false ,{ message : 'Password incorrect'});
                    }
                });
            });
        })
    );

    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });
    passport.deserializeUser((id,done)=>{
        User.findById(id, (err,user)=>{
            done(err,user);
        });
    });
}
