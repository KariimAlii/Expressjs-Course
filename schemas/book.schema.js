const Joi = require('joi');

const bookSchema = Joi.object({
  id: Joi.string().guid().optional(),
  title: Joi.string().required().description('The title of the book'),
  author: Joi.string().required().description('The author of the book'),
  publishedYear: Joi.number().integer().min(0).description('The year the book was published'),
  isbn: Joi.string().regex(/\d{3}-\d{10}/).description('The isbn is not valid!!!!'),
});

module.exports = { bookSchema };
