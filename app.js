//! Import Express module
const express = require('express');

//! Initialize an Express app
const app = express();

//! Parse Request Body
app.use(express.json());

//! Configure (.env)
require("dotenv").config();

//! Define a port for the server to listen on
const PORT = process.env.PORT || 5000;

//! Set up a basic route to test the server
app.get('/', (req, res) => {
  res.send('Welcome to Express API!');
});

//! Example data (static)
const books = [
  { id: 1, title: 'The Catcher in the Rye', author: 'J.D. Salinger' },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
];

//! GET route to fetch all books
app.get('/api/books', (req, res) => {
  res.json(books);
});

//! POST route to add a new book
app.post('/api/books', express.json(), (req, res) => {
  const { title, author } = req.body;
  const newBook = { id: books.length + 1, title, author };
  books.push(newBook);
  res.status(201).json(newBook); // Return the newly created book
});


//! Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
