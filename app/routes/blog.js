const express = require('express');

const BlogController = require('../controllers/blog.js');

const router = express.Router();

router.get('/', BlogController.getBlogPostsByPage);

// Blog Pages
router.get('/page/:pageNum', BlogController.getBlogPostsByPage);

// Individual Id
router.get('/id/:id', BlogController.getBlogPostById);

router.get('/tag/:tag', BlogController.getBlogPostsByTag);

// Individual Blog Post by Slug
router.get('/:slug', BlogController.getBlogPostBySlug);

module.exports = router;