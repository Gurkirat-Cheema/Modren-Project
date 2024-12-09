const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Book = require('../models/Book');
const router = express.Router();

// Render Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Login User
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && (await bcrypt.compare(password, user.password))) {
            req.session.user = user; // Save user to the session
            res.redirect('/users/profile');
        } else {
            res.redirect('/users/login'); // Redirect back to login on failure
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Render Registration Page
router.get('/register', (req, res) => {
    res.render('register');
});

// Register User
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.redirect('/users/login'); // Redirect to login after successful registration
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Logout User
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/users/login');
});

// Render User Profile
router.get('/profile', async (req, res) => {
    if (!req.session.user) return res.redirect('/users/login');
    try {
        const user = await User.findById(req.session.user._id).populate('readingList');
        res.render('profile', { user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Render Reading List Page
router.get('/reading-list', async (req, res) => {
    if (!req.session.user) return res.redirect('/users/login');
    try {
        const user = await User.findById(req.session.user._id).populate('readingList');
        res.render('reading-list', { user });
    } catch (error) {
        console.error('Error fetching reading list:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Add a Book to the Reading List
router.post('/reading-list/add/:id', async (req, res) => {
    if (!req.session.user) return res.redirect('/users/login');
    try {
        const user = await User.findById(req.session.user._id);
        if (!user.readingList.includes(req.params.id)) {
            user.readingList.push(req.params.id);
            await user.save();
        }
        res.redirect('/users/reading-list');
    } catch (error) {
        console.error('Error adding book to reading list:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Remove a Book from the Reading List
router.post('/reading-list/remove/:id', async (req, res) => {
    if (!req.session.user) return res.redirect('/users/login');
    try {
        const user = await User.findById(req.session.user._id);
        user.readingList = user.readingList.filter(bookId => bookId.toString() !== req.params.id);
        user.progress.delete(req.params.id); // Remove progress tracking for the book
        await user.save();
        res.redirect('/users/reading-list');
    } catch (error) {
        console.error('Error removing book from reading list:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Update Reading Progress
router.post('/progress/:id', async (req, res) => {
    if (!req.session.user) return res.redirect('/users/login');
    const { pagesRead } = req.body;

    try {
        const user = await User.findById(req.session.user._id);
        const book = await Book.findById(req.params.id);

        if (!book || !book.pages) {
            return res.status(400).send('Invalid book or missing total pages.');
        }

        // Ensure pagesRead doesn't exceed the total pages
        const validPagesRead = Math.min(Number(pagesRead), book.pages);
        user.progress.set(req.params.id, validPagesRead);
        await user.save();
        res.redirect('/users/profile');
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;







