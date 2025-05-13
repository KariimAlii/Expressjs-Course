// models/bookModel.js
const mongoose = require('mongoose');

// Define the schema for the Book model
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    publishedYear: {
        type: Number,
        required: true,
    },
});

// Create a model based on the schema
const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

module.exports = Book;
