const Joi = require('joi');

const bookSchema = Joi.object({
  id: Joi.string().guid().optional(),
  title: Joi.string().required().description('The title of the book'),
  author: Joi.string().required().description('The author of the book'),
  publishedYear: Joi.number().integer().min(0).description('The year the book was published'),
  isbn: Joi.string().regex(/\d{3}-\d{10}/).description('The isbn is not valid!!!!'),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      errors: error.details.map((detail) => ({
        msg: detail.message,
        field: detail.context.key,
      })),
    });
  }
  next();
};

module.exports = {
  validateCreateBook: validate(bookSchema),
  bookSchema
};
