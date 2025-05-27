//! Import Dependencies
const express = require('express');
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const cors = require('cors');

const seedBooks = require("./seedings/seedBooks");
const seedRoles = require("./seedings/seedRoles");

const swaggerJsdoc = require('swagger-jsdoc');
const openApiDocument = require('./swagger/openapi');
const swaggerUi = require('swagger-ui-express');

const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const path = require('path');

//! Import Controllers
const booksController = require('./controllers/BooksController');




//! Initialize an Express app
const app = express();
app.use(cors());
//! Logging Middleware
app.use(morgan(":method :url :response-time"));

//! Parse Request Body
app.use(express.json());

//! Parse Request Cookies
app.use(cookieParser());

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
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
        return err;
        // if(!err.originalError) {
        //     return err;
        // } else {
        //     const data = err.originalError.data;
        //     const code = err.originalError.code || 500;
        //     const message = err.message || 'An Error occured...';
        //     return {message, status: code , data};
        // }
    }
}))
//! Not Found Middleware
app.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
});

//! Error Middleware
app.use((error, req, res, next) => {
    // Mongoose validation error
    if (error.name === 'ValidationError') {
        const errorMessages = Object.values(error.errors).map(e => e.message);
        return res.status(400).json({ errorMessages });
    }

    // Joi validation error
    if (error.isJoi) {
        return res.status(400).json({ errors: err.details });
    }
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
      await seedRoles();
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
      });
    })
    .catch((error) => console.log(`DB ERROR: ${error}`));


