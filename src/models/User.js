const mongoose = require('../database/connection');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,

        required: true
    }, email: {
        type: String,
        unique: true, 
        lowercase: true,

        required: true
    },
    password: {
        type: String,
        select: false,

        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    }
});

UserSchema.pre('save', async function ( next ) {
    
    const hashedPasswd = await bcrypt.hash(this.password, 10);
    this.password = hashedPasswd;

    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;