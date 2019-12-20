const express = require('express');

const Blog = require('../controllers/blog.js');

const router = express.Router();

const placeholder = (req, res, next) => {
  next();
};

//Front Page
router.get('/', placeholder);

// Individual Blog Posts
router.get('/blog/:slug', placeholder);

// Blog Pages
router.get('/page/:pageNum', placeholder);

module.exports = router;