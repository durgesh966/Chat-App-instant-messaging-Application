const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    hashPassword: {
        type: String,
        required: true,
    },
    profileImage: {
        type: mongoose.Schema.Types.Mixed
    },
    bio: {
        type: String
    },
    status: {
        type: String,
        default: "0"
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
