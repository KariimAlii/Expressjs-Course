const express = require("express");
const router = express.Router();
const controller = require("../controllers/BooksController");
const booksController = require("../controllers/BooksController");
const {createBookValidation, validate, validateCreateBook: validateCreateBookByExpressValidation} = require("../express-validator-schemas/book.schema");
const { validateCreateBook: validateCreateBookByJoi } = require('../schemas/book.schema');
const {protect} = require("../middlewares/authMiddleware");

router
    .route("/api/books")
    .all(protect) // protected by the protect middleware, ensuring that only users with a valid JWT can access it.
    .get(
        controller.getBooks,
    )
    .post(

        // option 1 using express validator
        // createBookValidation,
        // validate,

        // option 2 using express validator
        // validateCreateBookByExpressValidation,

        // option 3 using Joi
        validateCreateBookByJoi,

        controller.addBook
    );

router
    .route("/books/:id")
    .patch(
        controller.updateBook
    )
    .put(
        controller.updateBook
    )
    .delete(
        controller.deleteBook
    );

module.exports = router;

