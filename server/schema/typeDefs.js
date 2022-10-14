//importing gql
const { gql } = require('apollo-server-express');
const typeDefs = gql;

type Book {
  _id: ID!
  bookID: String
  authorsAmt: String
  authors: [String]
  image: String
  link: String
  title: String
}

type User {
_id: ID!
bookAmt: Int
username: String
email: String
savedBooks: [Book]
}

