const queue=require('../config/kue');

const forgotPasswordMailer=require('../mailers/forgot_password_mailer');


// defining worker for forgot password mail
queue.process('emails',function(job,done){
    forgotPasswordMailer.forgotPassword(job.data);
    done();  
});