// require User Model
const User=require('../models/user');
require('dotenv').config();

const ForgotPassWord=require('../models/forgot_password');
// require request model for google captch verification
const request=require('request');

// require bcrypt for password encryption and decryption
const Bcrypt=require('bcryptjs');

// require crypto for generating access token
const crypto = require('crypto');

// require password mailer and queue for sending mails and parallel job handling
const forgotPasswordMailer=require('../mailers/forgot_password_mailer');
const queue=require('../config/kue');
const forgotPasswordEmailWorker=require('../workers/forgot_password_worker');

// require forgotpassword schema
const ForgotPassword = require('../models/forgot_password');



// profile function
module.exports.profile=function(req,res){
    return res.render('user_profile');
}


// Create new User function
module.exports.create=function(req,res){

    // Check for empty google captcha, if empty then return back
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        req.flash('error', 'Captcha Failed');

        return res.redirect('back');
      }

    //   If not empty  then we check the google captcha provided secret key  
      var secretKey = process.env.CAPTCHA_SECRET_KEY;

      var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;


    //   making request for captcha validation
      request(verificationUrl,function(error,response,body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if(body.success !== undefined && !body.success) {
            req.flash('error', 'Failed Captcha Verification');
            return res.redirect('back');
        }


    // Check if password and confirm password are dame
    if(req.body.password!=req.body.confirm_password){
        req.flash('error','Confirm Password does not match');
        return res.redirect('back');
    }

    // find user in Users model with email
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            req.flash('error','Error in fnding User');
            console.log('Error in finding user in signingup');
            return ;
        }

        // If user not found, then create user with encrypting the password
        if(!user){
            req.body.password=Bcrypt.hashSync(req.body.password,10);
            User.create(req.body,function(err,user){
                if(err){
                    req.flash('error','Error in Creating User');
                    console.log('error in creating user');
                    return ;
                }
                req.flash('error','Registered Successfully');
                return res.redirect('/users/sign-in');
            })
        }else{
            // If user already exists, return user already exists
            req.flash('error','User Already Exists');
            return res.redirect('back');
        }
    });

});
}




// function for signup
module.exports.signUp=function(req,res){
    // check if user is logged in ,return to profile
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
   }
//    else render the signup page
   return res.render("user_sign_up",{
       title:"SignUp"
   });
}




// create session and makes user login 
module.exports.createSession=function(req,res){
    req.flash('success','LoggedIn successfully');
    return res.redirect('/');
}




// function for signIn
module.exports.signIn=function(req,res){
    // check if user is loggedin, redirect it to profile
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    // else render signin page
    return res.render("user_sign_in",{
        title:"SignIn"
    });
}




// function for logout
module.exports.signOut=function(req,res){
    req.logout();
    req.flash('success','LoggedOut successfully');
    res.redirect('/'); 
    
}




// rendering reset password page
module.exports.resetPage=function(req,res){
    return res.render("user_reset_password");
}





// function for reset password
module.exports.resetPassword=function(req,res){
    //return back if confirm passwordds dont match  
    if(req.body.new_password!=req.body.confirm_new_password){
        req.flash('error','Confirm Password doesnot match');
        return res.redirect('back');
    }
    
    // else find user wth email
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            req.flash('error','Error in finding User');
            console.log(`Error in finding the user while reset password: ${err}`);
        }

        // checking the db password with entered one after decrypting dp password
        if(Bcrypt.compareSync(req.body.old_password,user.password)){
            req.body.new_password=Bcrypt.hashSync(req.body.new_password,10);
            // Update the new password after encrypting
            User.findOneAndUpdate({email:req.body.email},{$set:{password:req.body.new_password}},function(err,success){
                if(err){
                    req.flash('error','Error in Reset Password');
                    console.log(`Error in reset password : ${err}`);
                }
                req.flash('success','Password Updated Successfully');
                return res.redirect("/users/profile");
            });
        }
        // If password doesnt matches, then return back 
        else{
            req.flash('error','Old Password is Incorrect');
            return res.redirect('back');
        }
        
    });
}



// renders page asking for email for forgot password

module.exports.forgotEmailPage=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('forgot_password');
}


// creating job for mail and create accesstoken in db

module.exports.forgotPassword=function(req,res){
    // find user with email
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            req.flash('error',"error in finding email");
            return ;
        }
        // if user not found, return 
        if(!user){
            req.flash('error','Email doesnt exists');
            return res.redirect('back');
        }

        // else create accesstoken in db and enqueue parallel job

        const accessToken = crypto.randomBytes(20).toString('hex');
        ForgotPassword.create({user:req.body.email,accessToken:accessToken,isValid:true},function(err,data){
            if(err){
                console.log('error in storing accesstoken in db',err);
                return ;
            }
            console.log('Access Token Stored in DB',data);
        });

        // creating job
        let job=queue.create('emails',{email:user.email,accessToken:accessToken}).save(function(err){
            if(err){
                console.log(`Error in creating a queue :: ${err}`);
                return ;
            }
            console.log('job enqueued',job.id);
        });
        req.flash('success','Check your mail for creating new password');
        return res.redirect('back');

    });
}




// function for checking the boolean value and renders the page

module.exports.forgotCreatePassWord=function(req,res){
    // accessing access token from params
    const accessToken=req.params.id;
    //finding document with access token
    ForgotPassword.findOne({accessToken:accessToken},function(err,user){
        if(err){
            console.log("Error in finding accessToken:: ", err);
        }

        // if boolean is true 
        if(user.isValid==true){
            console.log(accessToken);
            // set the boolean value to false 
            ForgotPassword.findOneAndUpdate({accessToken:accessToken},{$set:{isValid:false}},function(err,success){
                if(err){
                    console.log("Error in updating boolean ", err);
                    return ;
                }
                // renders the create password page
                console.log(success);
                return res.render('forgot_create_password',{
                    email: user.user
                });
            });
            
        }
        // if boolean value is false, return 
        else{
            req.flash('error','Link Expired');
            return res.redirect('back');
        }
        
    });
}


// function for updating password neterd by the user through email

module.exports.updatePassword=function(req,res){
    // check if pwd and confoirm pwd matches
    if(req.body.new_password!=req.body.confirm_new_password){
        req.flash('error','Confirm Password mismatch');
        return res.redirect('/');
    }
    // encrypts the password
    req.body.new_password=Bcrypt.hashSync(req.body.new_password,10);
    
    // finding user with email and updating password
    User.findOneAndUpdate({email:req.body.email},{$set:{password:req.body.new_password}},function(err,success){
        if(err){
            console.log("error in updating password",err);
            return ;
        }
        console.log(success);
        req.flash('success','password updated successfully');
        return res.redirect('/');
    });
}