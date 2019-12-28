const express = require('express');

const postController = require('../controllers/blog-admin.js');
const authController = require('../controllers/auth.js');

const router = express.Router();

const placeholder = (req, res, next) => {
    res.send("Admin Section!");
};

//Gets the admin panel
router.get('/', placeholder);

//Gets a full post list including unpublished posts
router.get('/list', authController.authenticateToken, postController.getPostList);

//Adds a new post, will redirect to the edit page after completion
router.post('/add', authController.authenticateToken, postController.addPost);

//Gets the Edit Post form data
router.post('/edit', authController.authenticateToken, postController.editPost);

//Deletes a post, redirects to the post list
router.post('/delete', authController.authenticateToken, postController.deletePost);

router.post('/publish',
    authController.authenticateToken,
    (req, res, next) => {
        req.publication = true;
        next();
    },
    postController.changePublication);

router.post('/unpublish',
    authController.authenticateToken,
    (req, res, next) => {
        req.publication = false;
        next();
    },
    postController.changePublication);

module.exports = router;