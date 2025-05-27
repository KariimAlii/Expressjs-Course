const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLSchema, GraphQLInputObjectType, GraphQLNonNull, GraphQLID } = require('graphql');
const Book = require('../models/book');
const User = require('../models/user');
const Role = require('../models/role');
const { bookSchema } = require('../schemas/book.schema');

// TestData Type
const TestDataType = new GraphQLObjectType({
    name: 'TestData',
    fields: () => ({
        text: { type: GraphQLString },
        views: { type: GraphQLInt },
    }),
});

// Book Type
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        title: { type: GraphQLString },
        author: { type: GraphQLString },
        publishedYear: { type: GraphQLInt },
        isbn: { type: GraphQLString },
    }),
});

// User Type
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: { type: GraphQLID },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        status: { type: GraphQLString },
        posts: { type: new GraphQLList(PostType) },
    }),
});

// Post Type
const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        _id: { type: GraphQLID },
        title: { type: GraphQLString },
        body: { type: GraphQLString },
        creator: { type: UserType },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
    }),
});

// Product Filter Input
const ProductFilterInput = new GraphQLInputObjectType({
    name: 'ProductFilterInput',
    fields: () => ({
        minYear: { type: GraphQLInt },
        maxYear: { type: GraphQLInt },
        title: { type: GraphQLString },
    }),
});

// CreateUserDto Input
const CreateUserDtoInput = new GraphQLInputObjectType({
    name: 'CreateUserDto',
    fields: () => ({
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
    }),
});

// CreateBookDto Input
const CreateBookDtoInput = new GraphQLInputObjectType({
    name: 'CreateBookDto',
    fields: () => ({
        title: { type: new GraphQLNonNull(GraphQLString) },
        author: { type: new GraphQLNonNull(GraphQLString) },
        publishedYear: { type: new GraphQLNonNull(GraphQLInt) },
        isbn: { type: new GraphQLNonNull(GraphQLString) },
    }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        hello: {
            type: TestDataType,
            resolve() {
                return {
                    text: 'Hello World!',
                    views: 1245,
                };
            },
        },
        findBookWithFilters: {
            type: new GraphQLList(BookType),
            args: {
                filter: { type: ProductFilterInput },
            },
            async resolve(parent, args) {
                const { filter } = args;
                const query = {};
                if (filter?.minYear) query.publishedYear = { ...query.publishedYear, $gte: filter.minYear };
                if (filter?.maxYear) query.publishedYear = { ...query.publishedYear, $lte: filter.maxYear };
                if (filter?.title) query.title = { $regex: filter.title, $options: 'i' };
                return await Book.find(query);
            },
        },
    },
});

// Root Mutation
const RootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                userInput: { type: new GraphQLNonNull(CreateUserDtoInput) },
            },
            async resolve(parent, args, context) {
                const { userInput } = args;
                const existingUser = await User.findOne({ email: userInput.email });

                if (existingUser) {
                    throw new Error('User already exists');
                }

                const userRole = await Role.findOne({ name: "User" });

                const user = new User({
                    email: userInput.email,
                    password: userInput.password,
                    roles: [userRole._id]
                });

                const createdUser = await user.save();
                return { ...createdUser._doc, _id: createdUser._id.toString() };
            },
        },
        createBook: {
            type: BookType,
            args: {
                bookInput: { type: new GraphQLNonNull(CreateBookDtoInput) },
            },
            async resolve(parent, args) {
                const { bookInput } = args;
                const { error, value } = bookSchema.validate(bookInput, { abortEarly: false });

                if (error) {
                    const customError = new Error("Error validating book schema");
                    customError.data = error;
                    customError.code = 400;
                    throw customError;
                }

                const { title, author, publishedYear, isbn } = bookInput;
                const newBook = new Book({ title, author, publishedYear, isbn });
                await newBook.save();
                return newBook;
            },
        },
    },
});

// Export the complete schema
module.exports.schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});