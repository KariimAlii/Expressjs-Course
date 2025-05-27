const { buildSchema } = require('graphql');


module.exports = buildSchema(`
    type TestData {
        text: String!
        views: Int
    }
    input ProductFilterInput {
      minYear: Int
      maxYear: Int
      title: String
    }
    type RootQuery {
        hello: TestData!
        findBookWithFilters(filter: ProductFilterInput): [Book]
    }
    type Post {
        _id: ID!
        title: String!
        body: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }
    type User {
        _id: ID!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }
    input CreateUserDto {
        email: String!
        password: String!
    }
    input CreateBookDto {
        title: String!
        author: String!
        publishedYear: String!
        isbn: String!
    }
    type Book {
        title: String!
        author: String!
        publishedYear: String!
        isbn: String!
    }
    type RootMutation {
        createUser(userInput: CreateUserDto): User!
        createBook(bookInput: CreateBookDto): Book!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

// SDL stands for Schema Definition Language,
// and it is a standard, framework-independent way to define a GraphQL schema.
