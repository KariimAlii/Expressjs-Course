// seed.js
const Book = require('../models/Book');

const seedBooks = async () => {
    const count = await Book.countDocuments();
    if (count === 0) {
        await Book.insertMany([
            {
                title: '1984',
                author: 'George Orwell',
                publishedYear: 1949
            },
            {
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                publishedYear: 1960
            },
            {
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                publishedYear: 1925
            }
        ]);
        console.log('📚 Seed data inserted');
    } else {
        console.log('✅ Seed data already exists. Skipping...');
    }
};

module.exports = seedBooks;
