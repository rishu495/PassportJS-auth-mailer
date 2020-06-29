// require passport 
const passport=require('passport');

// require Bcrypt for encrypting the password
const Bcrypt=require('bcryptjs');

require('dotenv').config();
// require request model for google captch verification
const request=require('request');
// require localStrategy for passport-local
const localStrategy=require('passport-local').Strategy;

// require User model
const User=require('../models/user');



// Using local Strategy 
passport.use(new localStrategy({
    usernameField: 'email',
    passReqToCallback: true
},
    function(req,email,password,done){


        // checks for google captcha first
// **********************************************************************************
        // Check for empty google captcha, if empty then return back
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        req.flash('error', 'Captcha Failed');

        return done(null,false);
      }

    //   If not empty  then we check the google captcha provided secret key  
      var secretKey = process.env.CAPTCHA_SECRET_KEY;

      var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;


    //   making request for captcha validation
      request(verificationUrl,function(error,response,body) {   
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if(body.success !== undefined && !body.success) {
            req.flash('error', 'Captcha Failed');
            return done(null,false);
        }
    });

    // ********************************************************************
    // Google Captcha Finishes


        // finds the email in db
        User.findOne({email:email},function(err,user){
            if(err){
                req.flash('error','Error in finding User');
                return done(err);
            }
            // if user not found in db or password not matches with entered one, then return to back page 
            if(!user || !Bcrypt.compareSync(password,user.password)){
                req.flash('error','Wrong Credentials');
                return done(null,false);
            }
            // user found and password correct, login done!!
            return done(null,user);
        });
    }
));



// serializing the cookie

passport.serializeUser(function(user,done){
    done(null,user.id);
});



// deserializing the cookie

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('Error in finding the user');
        }
        return done(null,user);
    });
});



// checking if user is logged in or not
passport.checkAuthentication=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/users/sign-in');
}

// setting the user details in locals of the passport session
passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user=req.user;
    }
    next();
}

// export module
module.exports=passport;





















































