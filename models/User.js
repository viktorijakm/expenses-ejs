const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,  
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    }
    , { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();  

    // Hash password
    try{
        const salt = await bcrypt.genSalt(10);  
    this.password = await bcrypt.hash(this.password, salt);  
    next();
    } catch (error) {
        next(error);
    }
    
});

// check password match
userSchema.methods.matchPassword = async function (password) {

    console.log("Comparing:", password.trim(), this.password.trim());

    return await bcrypt.compare(password.trim(), this.password.trim());  // compare entered password with hashed password
};

const User = mongoose.model('User', userSchema);


module.exports = User;
