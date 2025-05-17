const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

// Middleware to protect routes
// Authorization Header: We check the Authorization header for the JWT token. If the token is present, we verify it using jwt.verify().
// Error Handling: If the token is missing or invalid, a 401 Unauthorized status code is returned.
const protect = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    // const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: 'No token, Authentication denied' });
    }

        const decoded = jwt.verify(token, process.env.Access_Token_SECRET);

        const user = await User.findById(decoded.userId).populate("roles");

        if (!user)
            return res.status(401).json({ message: "User not found" });

        req.user = user;

        next();
};

// authorizeRoles() function: This middleware checks if the authenticated user’s role is included in the list of allowed roles.
// If not, it returns a 403 Forbidden response.
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRoles = req.user.roles.map(r => r.name);
        const hasAccess = allowedRoles.some(role => userRoles.includes(role));
        if (!hasAccess) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};

module.exports = {protect, authorizeRoles};
