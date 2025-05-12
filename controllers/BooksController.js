const bookSchema = require('../schemas/book.schema.js')
console.log(bookSchema)
//! Static books data
const books = [
  { id: 1, title: 'The Catcher in the Rye', author: 'J.D. Salinger' },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
];

//! Controller to handle GET request for books
exports.getBooks = (req, res) => {
  res.json(books);
};

//! Controller to handle POST request to add a book
exports.addBook = (req, res) => {
    debugger
  const { error, value } = bookSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // If there are validation errors, return them in the response
    return res.status(400).json({ errors: error.details });
  }
  const { title, author } = req.body;
  const newBook = { id: books.length + 1, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
};

exports.updateBook = (req, res) => {
    const { error, value } = bookSchema.validate(req.body, { abortEarly: false });
   if (error) 
    return res.status(400).json({ errors: error.details });
    const { id, title, author } = req.body;
    const book = books.find(b => b.id == id);
    book.title = title;
    book.author = author;
    res.status(200);
}

// PUT /books/:id
exports.updateBook = (req, res) => {
  const { id } = req.params;      // Path variable
  const { title, author } = req.body;

  const book = books.find(b => b.id === parseInt(id));

  if (!book) 
    return res.status(404).json({ message: "Book not found" });

  book.title = title || book.title;

  book.author = author || book.author;

  res.json(book);
};

// DELETE /books/:id
exports.deleteBook = (req, res) => {
  const { id } = req.params;

  const index = books.findIndex(b => b.id === parseInt(id));

  if (index === -1) 
    return res.status(404).json({ message: "Book not found" });

  const deletedBook = books.splice(index, 1);

  res.json(deletedBook[0]);
};

//! How to read data from the rqeuest
//!===============================================================
//* req.query → Query parameters (e.g. ?sort=asc)

//* req.params → Path variables (e.g. /books/:id)

//* req.headers → Request headers

//* req.body → JSON body (for POST/PUT requests)
