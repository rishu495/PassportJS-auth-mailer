// require nodemailer
const nodemailer = require('nodemailer');
// require ejs
const ejs=require('ejs');

require('dotenv').config();
// require path to join paths
const path=require('path');

// setting up the mail authorization using transporter
let transporter=nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:process.env.GOOGLE_USERNAME,
        pass:process.env.GOOGLE_PASSWORD
    },
});

// rendering the html email template
let renderTemplate=(data,relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log(`Error in renderin template :: ${err}`);
                return ;
            }
            mailHTML=template;
        }
    )
    return mailHTML;
}


// exports module
module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate
}