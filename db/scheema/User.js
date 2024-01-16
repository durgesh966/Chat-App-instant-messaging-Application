const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        requred: true,
    },
    email:{
        type:String,
        unique: true, 
        required:true
    },
    hashPassword:{
        type:String,
        required:true,
    },
    profileImage:{
        type:String,
        required:true,
    }  
});

module.exports = mongoose.model('User', userSchema);