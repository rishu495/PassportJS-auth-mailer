                                    Authentication APP With MAILER INTEGRATED
Authentication App bulilt in NodeJS and Express
---------OverView

Complete Authentication System with all Checks using PassportJS

---------Bonus Features & Implementation details :-

-------------------------------->>>>>>Google captcha doesn't support localhost domain, so run this app using following url :- http://127.0.0.1:8000/
-------------------------------->>>>>>Put all your keys in .env_sample file

1.GoogleCaptcha during sign in/sign up

2.Reset password feature after login

3.Forgot Password with link send with the help of access token

4.Bcrypto library for encryption of passwords

5.Kue and Redis for parallel job execution of sending mails for passwords in order to implement forget password feature


<!-- Steps to use this application for your own project -->
1.npm init --> Do the required configuration

2.install mongoDB

3.As it uses many dependencies so you have to install required dependencies. Go to project folder and type in terminal --> npm install package_name

4.package_name are as follows -->

"connect-flash", "connect-mongo", "crypto", "ejs", "express", "express-ejs-layouts", "express-session", "mongoose", "node-sass-middleware", "passport", "passport-google-oauth", "passport-local", "bcryptjs","request", "nodemailer", "kue", "dotenv", "connect-flash"

5.Type in terminal npm start . Following this steps you will be good to go
