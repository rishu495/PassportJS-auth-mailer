const express=require('express');
const app=express();
const port=8000;
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');

// set path for static files
app.use(express.static('./assets'));

// extract styles and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Use express Layout
app.use(expressLayouts);

// Use express Router
app.use('/',require('./routes'));

// set up the view engine
app.set('view engine','ejs');

// set up the path os views
app.set('views','./views');



app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port :: ${port}`);
});