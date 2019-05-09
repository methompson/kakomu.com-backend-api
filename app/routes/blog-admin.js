const express = require('express');

const postController = require('../controllers/blog-admin.js');

const router = express.Router();

//Gets the admin panel
router.get('/admin', (req, res, next) => {
    res.send("<h1>Hi Things!</h1>");
});

//Gets a post list
router.get('/post-list', (req, res, next) => {
    res.send('post-list');
});

//Gets the Add Post form
router.get('/add-post', postController.getAddPostPage);

//Adds a new post, will redirect to the edit page after completion
router.post('/add-post', postController.addNewPost);

//Gets the Edit Post form
router.get('/edit-post/:slug', postController.getEditPostPage);

// This is erroneous and the user forwarded to the add-post form
router.get('/edit-post', (req, res, next) => {
    return res.redirect('/add-post');
});

//Edits a post, redirects to the Edit page form
router.post('/edit-post', postController.editPost);

//Gets the delete post form
router.get('/delete-post', (req, res, next) => {
    res.send('delete-post');
});

//Deletes a post, redirects to the post list
router.post('/delete-post', (req, res, next) => {
    console.log('delete-post');
    res.redirect('/post-list');
});

module.exports = router;