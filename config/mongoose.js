// require monggose
const mongoose=require('mongoose');

// make connection with db
mongoose.connect('mongodb://localhost/PassportJS_auth_mailer');


const db=mongoose.connection;

// Error in connecting with db
db.on('error',console.error.bind(console,"Error connecting to MongoDB"));

// successfully connected
db.once('open',function(){
    console.log('Connected to Databse :: MongoDb');
});

module.exports=db;