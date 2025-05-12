
require('dotenv').config();
const { bookSchema } = require('../schemas/book.schema');
const j2s = require('joi-to-swagger');

const { swagger: bookSwaggerSchema } = j2s(bookSchema);

const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

const openApiDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Books API',
    version: '1.0.0',
    description: 'API for managing books',
  },
  servers: [
    {
      url: baseUrl,
    },
  ],
  paths: {
    '/api/books': {
      get: {
        summary: 'Get all books',
        responses: {
          200: {
            description: 'List of books',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Book' },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Add a new book',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Book' },
            },
          },
        },
        responses: {
          201: {
            description: 'Book created',
          },
          400: {
            description: 'Validation failed',
          },
        },
      },
    },
    '/api/books/{id}': {
      put: {
        summary: 'Update a book',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Book' },
            },
          },
        },
        responses: {
          200: { description: 'Book updated' },
          400: { description: 'Validation error' },
        },
      },
      delete: {
        summary: 'Delete a book',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          204: { description: 'Book deleted' },
        },
      },
    },
  },
  components: {
    schemas: {
      Book: bookSwaggerSchema,
    },
  },
};

module.exports = openApiDocument;
