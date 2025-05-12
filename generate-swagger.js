// generate-swagger.js
const fs = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Books API',
      version: '1.0.0',
      description: 'A simple CRUD API for managing books',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./app.js'], // Add more files as needed
};

const swaggerSpec = swaggerJsdoc(options);

fs.writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));
console.log('✅ Swagger JSON generated at ./swagger.json');
