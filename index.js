// require express
const express=require('express');

require('dotenv').config();
// require cookie-pasrse for creating cookies
const cookieParser=require('cookie-parser');

const app=express();
const port=8000;

// require ejs layouts
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');

// require passport google for google verification
const passportGoogle=require('./config/passport-google-oauth2-strategy');


app.use(express.urlencoded());
app.use(cookieParser());

// for passport and session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');

// storing users session in databse
const MongoStore=require('connect-mongo')(session);

// using sass middleware for scss files
const sassMiddleware=require('node-sass-middleware');


const flash=require('connect-flash');
const notiMware=require('./config/notification-middleware');



// set path for static files

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug:'true',
    outputStyle: 'extended',
    prefix: '/css'
}));

// path for assest
app.use(express.static('./assets'));


// extract styles and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Use express Layout
app.use(expressLayouts);



// set up the view engine
app.set('view engine','ejs');

// set up the path os views
app.set('views','./views');



// storing the cookie in browser
app.use(session({
    name: 'passportJS-auth-mailer',
    secret:'passportJS-auth-mailer',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(6000000)
    },
    store: new MongoStore(
        {
            mongooseConnection: db
        },
        function(err){
            console.log(err || "connect mongodb setUp");
        }
    )
}));

// inititlaize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
// use flash for notification
app.use(flash());
app.use(notiMware.setFlash);

// Use express Router
app.use('/',require('./routes'));


// listen requests on port 8000
app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port :: ${port}`);
});