const express = require('express');

// const postController = require('../controllers/blog-admin.js');

const router = express.Router();

const placeholder = (req, res, next) => {
    res.send("Admin Section!");
};

//Gets the admin panel
router.get('/', placeholder);

//Gets a post list
router.get('/post-list', placeholder);

//Adds a new post, will redirect to the edit page after completion
router.post('/add-post', placeholder);

//Gets the Edit Post form data
router.get('/edit-post/:slug', placeholder);

//Deletes a post, redirects to the post list
router.post('/delete-post', placeholder);

module.exports = router;