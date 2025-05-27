const User = require('../models/User');
const Role = require("../models/role");
const Book = require("../models/book");
const {bookSchema} = require('../schemas/book.schema')
module.exports = {
    hello() {
        // return 'Hello World!';
        return {
            text: 'Hello World!',
            views: 1245
        };
    },
    // createUser(args, request) {
    //     const userInput = args.userInput;
    // }

    // createUser({ userInput }, request) {
    // }

    createUser: async function({ userInput }, request) {
        const existingUser = await User.findOne({email: userInput.email});

        if (existingUser) {
            throw new Error('User not found');
        }

        const userRole = await Role.findOne({ name: "User" });

        const user = new User({
            email: userInput.email,
            password: userInput.password,
            roles: [userRole._id]
        });

        const createdUser = await user.save();

        return {...createdUser._doc, _id: createdUser._id.toString()};
    },
    createBook: async({ bookInput }) => {
        const { error, value } = bookSchema.validate(bookInput, { abortEarly: false });
        if (error)
            throw new Error(error);
        const {title, author, publishedYear, isbn} = bookInput;
        const newBook = new Book({ title, author, publishedYear, isbn });
        await newBook.save();
        return newBook;
    },
    findBookWithFilters: async ({ filter }) => {
        const query = {};
        if (filter?.minYear) query.publishedYear = { ...query.publishedYear, $gte: filter.minYear };
        if (filter?.maxYear) query.publishedYear = { ...query.publishedYear, $lte: filter.maxYear };
        if (filter?.title) query.title = { $regex: filter.title, $options: 'i' };

        return await Book.find(query);
    }
}

// Using Postman
//=======================
// {
//     "query": "{ hello { text views } }"
// }
// {
//     "query": "mutation { createUser(userInput: { email: \"A@gmail.com\", password: \"A12345\" }) { _id email } }"
// }
// or using variables
// {
//     "query": "mutation CreateUser($email: String!, $password: String!) { createUser(userInput: { email: $email, password: $password }) { _id email } }",
//     "variables": {
//          "email": "K@gmail.com",
//          "password": "K12345"
//      }
// }

// Using Graphiql
//======================
// query {
//     hello {
//          text
//          views
//     }
// }
// mutation {
//     createUser(userInput:{
//         email:"K@gmail.com",
//             password: "K12345"
//     }) {
//         _id
//         email
//     }
// }

// mutation {
//     createBook (
//         bookInput:
//     {
//         title: "My Book",
//             author:"Karim",
//         publishedYear :"2010",
//         isbn: "978-1234567890"
//     }) {
//         title
//         author
//         publishedYear
//         isbn
//     }
// }



// query {
//     findBookWithFilters(filter:{minYear: 2000}) {title author publishedYear}
// }