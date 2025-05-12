//! Import Dependencies
const express = require('express');
const morgan = require("morgan");

//! Import Controllers
const booksController = require('./controllers/BooksController');

//! Initialize an Express app
const app = express();

//! Logging Middleware
app.use(morgan(":method :url :response-time"));

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

app.get('/api/books', booksController.getBooks);

app.post('/api/books', booksController.addBook);

app.put('/api/books/:id', booksController.updateBook); 

app.delete('/api/books/:id', booksController.deleteBook); 


//! Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
