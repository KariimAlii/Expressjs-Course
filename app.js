//! Import Dependencies
const express = require('express');
const morgan = require("morgan");
const mongoose = require("mongoose");

const seedBooks = require("./seedings/seedBooks");

const swaggerJsdoc = require('swagger-jsdoc');
const openApiDocument = require('./swagger/openapi');
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use('/swagger.json', express.static(path.join(__dirname, 'swagger.json')));



//! Set up a basic route to test the server
app.get('/', (req, res) => {
  res.send('Welcome to Express API!');
});


app.get('/api/books', booksController.getBooks);


app.post('/api/books', booksController.addBook);


app.put('/api/books/:id', booksController.updateBook); 


app.delete('/api/books/:id', booksController.deleteBook);

//! Not Found Middleware
app.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
});

//! Error Middleware
app.use((error, req, res, next) => {
    res.status(500).json({
        message: 'Something went wrong',
        details: error.message,
    });
});

//! Start the server
mongoose
    .connect("mongodb://127.0.0.1:27017/EcommerceSystem")
    .then(async () => {
      console.log("DB Connected ..");
      await seedBooks();
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
      });
    })
    .catch((error) => console.log(`DB ERROR: ${error}`));


