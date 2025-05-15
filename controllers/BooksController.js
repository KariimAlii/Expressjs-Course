const bookSchema = require('../schemas/book.schema.js')
const Book = require('../models/book');

//! Controller to handle GET request for books
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching books' });
    }
};

//! Controller to handle POST request to add a book
exports.addBook = async (req, res) => {
    try {
        const { title, author, publishedYear, isbn } = req.body;
        const newBook = new Book({ title, author, publishedYear, isbn });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessages = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors: errorMessages });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

// exports.updateBook = (req, res) => {
//     const { error, value } = bookSchema.validate(req.body, { abortEarly: false });
//    if (error)
//     return res.status(400).json({ errors: error.details });
//     const { id, title, author } = req.body;
//     const book = books.find(b => b.id == id);
//     book.title = title;
//     book.author = author;
//     res.status(200);
// }

// PUT /books/:id
exports.updateBook = async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: 'Error updating book' });
    }
};

// DELETE /books/:id
exports.deleteBook = async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting book' });
    }
};

//! How to read data from the rqeuest
//!===============================================================
//* req.query → Query parameters (e.g. ?sort=asc)

//* req.params → Path variables (e.g. /books/:id)

//* req.headers → Request headers

//* req.body → JSON body (for POST/PUT requests)
