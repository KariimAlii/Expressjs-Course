const User = require('../models/user');
const Role = require('../models/role');
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

    const userRole = await Role.findOne({ name: "User" });

    // Create a new user
    const user = new User({
            email,
            password,
            roles: [userRole._id]
    });
    await user.save();

    // Generate JWT
    // jsonwebtoken: A library for signing and verifying JWTs.
    // JWT Signing: After successfully creating the user, we sign a JWT using the jsonwebtoken library and return it in the response.
    // process.env.JWT_SECRET stores the secret key for signing the JWT, which should be defined in the .env file.
    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.Access_Token_SECRET,
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
    const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.Access_Token_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.Refresh_Token_SECRET,
        { expiresIn: '7d' }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res
        .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,     // for testing using https
            secure: false,     // for local testing using http
            sameSite: 'strict', // or Lax
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .json({
            message: 'Login successful',
            accessToken,
        });
};

const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token)
        return res.status(401).json({ message: 'No refresh token' });

    const decoded = jwt.verify(token, process.env.Refresh_Token_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== token) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Generate JWT
    const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.Access_Token_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.Refresh_Token_SECRET,
        { expiresIn: '7d' }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res
        .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // secure: true,     // for testing using https
            secure: false,     // for local testing using http
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .json({
            message: 'Login successful',
            accessToken,
        });
}
module.exports = { registerUser, loginUser, refreshToken };
