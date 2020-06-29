// require mail for nodemailer
const nodemailer=require('../config/nodemailer');
const User = require('../models/user');


// setting up the recepeints and html template of mail
exports.forgotPassword=(user)=>{
    let htmlString=nodemailer.renderTemplate({user: user},'/forgot_password_mailer/forgot_password.ejs');
    nodemailer.transporter.sendMail({
        from: 'rishabhagrawal495@gmail.com',
        to: user.email,
        subject: "Forgot Password",
        html:htmlString
    },(err,info)=>{
        if(err){
            console.log(`Error in sending mail :: ${err}`);
            return ;
        }
        console.log("Mail Delivered", info);
    });
}