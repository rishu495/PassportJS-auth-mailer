// require mongoose
const mongoose=require('mongoose');

// defining forgot password schema for storing access tokens
const forgotPasswordSchema=new mongoose.Schema({
    user:{
        type:String,
        required:true,
    },

    accessToken:{
        type:String,
        required:true
    },
    isValid:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
});

const ForgotPassword=mongoose.model('ForgotPassword',forgotPasswordSchema);

module.exports=ForgotPassword;