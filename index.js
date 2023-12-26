import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import db from './_db.js';

const resolvers = {
    Query: {
        games() {
            return db.games
        },
        game(_, { id }) {
            return db.games.find(game => game.id === id)
        },
        reviews() {
            return db.authors
        },
        review(_, { id }) {
            return db.reviews.find(review => review.id === id)
        },
        authors() {
            return db.reviews
        },
        author(_, { id }) {
            return db.authors.find(author => author.id === id)
        },
    },
    Game: {
        reviews(game) {
            return db.reviews.filter(review => review.game_id === game.id)
        }
    },
    Author: {
        reviews(author) {
            return db.reviews.filter(review => review.author_id === author.id)
        }
    },
    Review: {
        game(review) {
            return db.games.find(game => game.id === review.game_id)
        },
        author(review) {
            return db.authors.find(author => author.id === review.author_id)
        }
    },
    Mutation: {
        addGame(_, { game }) {
            const newGame = {
                id: String(db.games.length + 1),
                ...game
            }
            db.games.push(newGame)
            return newGame
        },
        updateGame(_, { id, game }) {
            const gameIndex = db.games.findIndex(game => game.id === id)
            const updatedGame = {
                ...db.games[gameIndex],
                ...game
            }
            db.games[gameIndex] = updatedGame
            return updatedGame
        },
        deleteGame(_, { id }) {
            db.games = db.games.filter(game => game.id !== id)
            return db.games
        },
    }
}
const server = new ApolloServer({
    typeDefs,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: {port: 4000}
});

console.log("Server ready at " + url + " 🚀");
