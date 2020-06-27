const mongoose=require('mongoose');


mongoose.connect('mongodb://localhost/PassportJS_auth_mailer');


const db=mongoose.connection;

db.on('error',console.error.bind(console,"Error connecting to MongoDB"));

db.once('open',function(){
    console.log('Connected to Databse :: MongoDb');
});

module.exports=db;