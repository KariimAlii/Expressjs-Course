//! Import Dependencies
const express = require('express');
const morgan = require("morgan");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

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

//! Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Books API',
      version: '1.0.0',
      description: 'A simple CRUD API for managing books',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./app.js'], // Define Swagger docs in this file
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/swagger.json', express.static(path.join(__dirname, 'swagger.json')));

//! Set up a basic route to test the server
app.get('/', (req, res) => {
  res.send('Welcome to Express API!');
});

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     responses:
 *       200:
 *         description: A list of books
 */
app.get('/api/books', booksController.getBooks);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Add a new book
 *     responses:
 *       201:
 *         description: Book created
 */
app.post('/api/books', booksController.addBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Book updated
 */
app.put('/api/books/:id', booksController.updateBook); 

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Book deleted
 */
app.delete('/api/books/:id', booksController.deleteBook); 


//! Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
