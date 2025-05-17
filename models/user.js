// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ],
    refreshToken: { type: String }
});

// Hash the password before saving it to the database
// pre('save'): This hook is called before saving a user to the database.
// It hashes the password using bcryptjs if the password has been modified.

userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});



// Method to compare the entered password with the hashed password in the database
// matchPassword(): This method compares the entered password with the hashed password stored in the database.
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

if (mongoose.models.User) {
    delete mongoose.models.User;
}

const User = mongoose.model('User', userSchema);

module.exports = User;


// bcryptjs: A library used for securely hashing passwords.




