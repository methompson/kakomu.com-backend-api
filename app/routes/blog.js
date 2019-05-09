const express = require('express');

const Blog = require('../controllers/blog.js');

const router = express.Router();

//Front Page
router.get('/', Blog.getBlogList);

// Individual Bloog Posts
router.get('/blog/:slug', Blog.getBlogPost);

module.exports = router;