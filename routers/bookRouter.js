const express = require("express");
const router = express.Router();
const controller = require("../controllers/BooksController");

router
    .route("/books")
    .get(
        controller.getBooks,
    )
    .post(
        controller.addBook
    )
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
