export const typeDefs= `#graphql
type Game{
id: ID!
title: String!
platform: String!
reviews:[Review!]
}
type Review{
    id: ID!
    rating: Float!
    content: String!
    author: Author!
} 
type Author{
    id : ID!
    name : String !
    verified : Boolean!
    reviews:[Review!]
}

type Query{
    games: [Game!]!
    reviews: [Review!]!
    review(id:ID!): Review
    game(id:ID!): Game
    authors: [Author!]!
    author(id:ID!): Author!
}


` 