// require mongoose for db schema
const mongoose= require('mongoose');

// creating Users Schema
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },
    name: {
        type:String,
        required:true
    }



},{
    timestamps:true
});


const User=mongoose.model('User',userSchema);

// export user schema
module.exports=User;