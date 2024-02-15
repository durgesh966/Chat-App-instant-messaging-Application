const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        requred: true,
    },
    phone:{
        type:String,
        unique: true, 
        required:true
    },
    hashPassword:{
        type:String,
        required:true,
    },
    profileImage:{
        
    },
    bio:{
        type:String
    } 
});

module.exports = mongoose.model('User', userSchema);