const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Open Library Cover Image URL Helper
const getCoverImage = (coverId) => coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : '/default-cover.jpg';

// Display all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.render('index', { books, getCoverImage });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Search books
router.get('/search', async (req, res) => {
    const { query } = req.query; // Get the search query from the query string
    try {
        // Search books by title, author, or keywords (case-insensitive)
        const books = await Book.find({
            $or: [
                { title: new RegExp(query, 'i') },
                { author: new RegExp(query, 'i') },
                { description: new RegExp(query, 'i') }
            ]
        });
        res.render('search-results', { books, query, getCoverImage });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.render('book-details', { book, coverImage: getCoverImage(book.coverId) });
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;



