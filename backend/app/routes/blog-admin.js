const express = require('express');

const postAdminController = require('../controllers/blog-admin.js');
const postController = require('../controllers/blog.js');
const authController = require('../controllers/auth.js');
const userAdminController = require('../controllers/user-admin.js');

const router = express.Router();

const placeholder = (req, res, next) => {
    res.send("Admin Section!");
};

//Gets the admin panel
router.get('/', placeholder);

router.post('/change-password', authController.authenticateToken, userAdminController.updateUserPassword);
router.post('/update-user', authController.authenticateToken, userAdminController.updateUser);

//Gets a full post list including unpublished posts
router.get('/list', authController.authenticateToken, postAdminController.getPostList);

//Adds a new post, will redirect to the edit page after completion
router.post('/add', authController.authenticateToken, postAdminController.addPost);

//Gets the Edit Post form data
router.post('/edit', authController.authenticateToken, postAdminController.editPost);

//Deletes a post, redirects to the post list
router.post('/delete', authController.authenticateToken, postAdminController.deletePost);

router.post('/publish',
    authController.authenticateToken,
    (req, res, next) => {
        req.publication = true;
        next();
    },
    postAdminController.changePublication);

router.post('/unpublish',
    authController.authenticateToken,
    (req, res, next) => {
        req.publication = false;
        next();
    },
    postAdminController.changePublication);

router.get('/post/:slug',
    authController.authenticateToken,
    postAdminController.getBlogPostBySlug,
    postController.getBlogPostBySlug);

module.exports = router;