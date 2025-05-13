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


// Some Notes about Mongoose
//====================================
// Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a higher-level abstraction for interacting with MongoDB, making it easier to work with data by defining schemas and models.

// Key features of Mongoose:
//====================================
// (1) Schemas: Define the structure of documents within a collection.

// (2) Models: Represent a MongoDB collection, and provide methods for querying and manipulating data.

// (3) Validation: Enforces data validation rules to ensure consistency in data.

// (4) Middleware: Supports hooks to run code before or after certain operations (e.g., before saving a document).