const express = require('express');

const postController = require('../controllers/blog-admin.js');

const router = express.Router();

const placeholder = (req, res, next) => {
    res.send("Admin Section!");
};

//Gets the admin panel
router.get('/', placeholder);

//Gets a post list
router.get('/post-list', postController.getPostList);

//Adds a new post, will redirect to the edit page after completion
router.post('/add-post', postController.addNewPost);

//Gets the Edit Post form data
router.post('/edit-post', postController.editPost);

//Deletes a post, redirects to the post list
router.post('/delete-post', placeholder);

module.exports = router;