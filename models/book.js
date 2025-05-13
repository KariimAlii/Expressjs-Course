// models/bookModel.js
const mongoose = require('mongoose');

// Define the schema for the Book model
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
    },
    publishedYear: {
        type: Number,
        required: [true, 'Published year is required'],
        min: [1900, 'Year must be greater than or equal to 1900'],
        max: [new Date().getFullYear(), `Year cannot be greater than ${new Date().getFullYear()}`],
    },
});

// Create a model based on the schema
const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

module.exports = Book;
