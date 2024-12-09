const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    description: String,
    coverId: String, // Open Library cover ID
    rating: Number,
    olid: String,    // Open Library ID
    borrowLink: String, // Borrowing link
    buyLink: String,    // Buying link
    pages: Number      // Total number of pages
});

module.exports = mongoose.model('Book', bookSchema);



