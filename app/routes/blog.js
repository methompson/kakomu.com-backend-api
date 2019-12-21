const express = require('express');

const Blog = require('../controllers/blog.js');

const router = express.Router();

//Front Page
router.get('/', (req, res, next) => {
    return Blog.getBlogPostsByPage(1)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(400).send({
                message: "Error retrieving blog posts",
                err,
            });
        });
});


// Blog Pages
router.get('/page/:pageNum', (req, res, next) => {

    let pageNum = Number(req.params.pageNum);
    if (isNaN(pageNum)){
        pageNum = 1;
    }

    return Blog.getBlogPostsByPage(pageNum)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(400).send({
                message: "Error retrieving blog posts",
                err,
            });
        });
});


// Individual Blog Posts
router.get('/:slug', (req, res, next) => {
    let output = "";
    if ('slug' in req.params){
        output = req.params.slug;
    }

    res.send("<p>Looking for " + output + "</p>");
});

router.get('tag/:tags', (req, res, next) => {
    let output = "";
    if ('tags' in req.params){
        output = req.params.tags;
    }

    res.send("<p>Searching for " + output + "</p>");
});

module.exports = router;