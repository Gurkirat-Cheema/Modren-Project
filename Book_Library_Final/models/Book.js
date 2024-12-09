const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    description: String,
    coverId: String, 
    rating: Number,
    olid: String,    
    borrowLink: String, 
    buyLink: String,    
    pages: Number      
});

module.exports = mongoose.model('Book', bookSchema);



