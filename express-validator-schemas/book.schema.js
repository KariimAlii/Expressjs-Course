// validators/bookValidator.js
const { body, validationResult } = require('express-validator');

// Define validation rules for creating a book
const createBookValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('publishedYear')
        .isInt({ min: 1900, max: new Date().getFullYear() })
        .withMessage('Published year must be a valid year between 1900 and the current year'),
    body('isbn').isString().matches(new RegExp('/\\d{3}-\\d{10}/')).withMessage("ISBN must be in the format XXX-XXXXXXXXXX"), // you can use .matches(/^\d{3}-\d{10}$/)
];

// Middleware to handle validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateCreateBook = [...createBookValidation, validate];

module.exports = {
    createBookValidation,
    validate,
    validateCreateBook
};
