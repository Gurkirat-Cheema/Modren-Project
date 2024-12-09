const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    readingList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    progress: {
        type: Map, // Map of book IDs to the number of pages read
        of: Number,
        default: {}
    }
});

module.exports = mongoose.model('User', userSchema);


