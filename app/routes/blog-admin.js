// routes for: /api/admin

const express = require('express');

const postAdminController = require('../controllers/blog-admin.js');
const postController = require('../controllers/blog.js');
const { getTokenFromHeaders, authenticateToken } = require('../controllers/auth.js');
const userAdminController = require('../controllers/user-admin.js');

const router = express.Router();

const placeholder = (req, res, next) => {
    res.send("Admin Section!");
};

//Gets the admin panel
router.get('/', placeholder);

router.post('/change-password', getTokenFromHeaders, authenticateToken, userAdminController.updateUserPassword);
router.post('/update-user', getTokenFromHeaders, authenticateToken, userAdminController.updateUser);

//Gets a full post list including unpublished posts
router.get('/list', getTokenFromHeaders, authenticateToken, postAdminController.getPostList);

//Adds a new post, will redirect to the edit page after completion
router.post('/add', getTokenFromHeaders, authenticateToken, postAdminController.addPost);

//Gets the Edit Post form data
router.post('/edit', getTokenFromHeaders, authenticateToken, postAdminController.editPost);

//Deletes a post, redirects to the post list
router.post('/delete', getTokenFromHeaders, authenticateToken, postAdminController.deletePost);

router.post(
    '/publish',
    getTokenFromHeaders,
    authenticateToken,
    (req, res, next) => {
        req.publication = true;
        next();
    },
    postAdminController.changePublication);

router.post(
    '/unpublish',
    getTokenFromHeaders,
    authenticateToken,
    (req, res, next) => {
        req.publication = false;
        next();
    },
    postAdminController.changePublication);

router.get(
    '/post/:slug',
    getTokenFromHeaders,
    authenticateToken,
    postAdminController.getBlogPostBySlug,
    postController.getBlogPostBySlug);

module.exports = router;