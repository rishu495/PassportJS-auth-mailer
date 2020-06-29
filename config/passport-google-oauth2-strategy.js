// require passport 
const passport=require('passport');
require('dotenv').config();
// require google oauth for google authentication
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;

// require crypto for random genearting the password
const crypto=require('crypto');

// require User Model
const User=require('../models/user');


// create google Strategy and set clientId,clientSecret and callback URL
passport.use(new googleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:"http://localhost:8000/users/auth/google/callback"
},

function(accessToken,refreshToken,profile,done){
    // finding the email returned by google in our own db
    User.findOne({email:profile.emails[0].value}).exec(function(err,user){
        if(err){console.log('error in google strategy-passport',err);return ;}
        
        // if user found then signin
        if(user){
            return done(null,user); 
        }else{
            // if not then create user with email with random password in our db
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex')
            }, function(err,user){
                if(err){console.log('error in creating user google strategy-passport',err);return ;}
                return done(null,user);
            });
        }
    });
}


));


// Export modules
module.exports=passport;
