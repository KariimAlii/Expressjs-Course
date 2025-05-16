const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Middleware to protect routes
// Authorization Header: We check the Authorization header for the JWT token. If the token is present, we verify it using jwt.verify().
// Error Handling: If the token is missing or invalid, a 401 Unauthorized status code is returned.
const protect = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, Authentication denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user info to the request object
        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = protect;
