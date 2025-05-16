const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Register a new user
const registerUser = async (req, res) => {
    const { email, password } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = new User({ email, password });
    await user.save();

    // Generate JWT
    // jsonwebtoken: A library for signing and verifying JWTs.
    // JWT Signing: After successfully creating the user, we sign a JWT using the jsonwebtoken library and return it in the response.
    // process.env.JWT_SECRET stores the secret key for signing the JWT, which should be defined in the .env file.
    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.status(201).json({
        message: 'User registered successfully',
        token,
    });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if the password matches
    // Password Validation: The matchPassword() method is used to compare the entered password with the hashed password stored in the database.
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({
        message: 'Login successful',
        token,
    });
};

module.exports = { registerUser, loginUser };
