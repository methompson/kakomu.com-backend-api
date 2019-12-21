const Sequelize = require('sequelize');
const slug = require('slug');

const {getBlogPostById} = require('./blog.js');

const Post = require('../models/post.js');

// This function queries the database for the provided
// slug, determines if it's unique and if not, returns a
// slug with a hyphenated number at the end
// oldSlug is the title prior to an edit
// the slug changes, but stays same enough to be included in the list
const getUniqueSlug = (title, oldSlug = "") => {
    let postSlug = slug(title);

    // Get all posts that start with the same slug
    const Op = Sequelize.Op;
    
    return Post.findAll({
        where:{
            slug: {
                [Op.like]: postSlug+"%",
            },
        },
    })
        .then( (results) => {
            console.log(results);
            //Collect the slugs in an array for easier comparisons
            const currentSlugs = {};
            results.forEach( (r) => {
                const s = r.dataValues.slug;
                currentSlugs[s] = s;
            });

            console.log("currentSlugs", currentSlugs);

            // The taken variable is used to get out of the while loop.
            // We iterate by 1 every loop to find a unique slug.
            let taken = true;
            let x = 1;
            while (taken){

                // This comparison resolves to true if the currently generated slug
                // Doesn't already exist in the array of similar slugs or
                // the generated slug is the same as the previous slug
                if (!(postSlug in currentSlugs) || postSlug === oldSlug){
                    taken = false;
                } else {
                    postSlug = slug(title) + '-' + x;
                    ++x;
                }
            }
            return postSlug;

        })
        .catch( (err) => {
            console.log(err);
        });
}


const getPostList = async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify([
        {
            title: "post",
            dateAdded: (new Date()).getTime(),
        },
    ]));
};

// Adds a blog post to the database
// The function is async because of an await with
// The Post database object
const addNewPost = async (req, res, next) => {

    console.log(req.body);

    // Checks if required fields are not filled. Right now, the
    // required field is the Title. If there is no title or its not filled,
    // send an error 400 and get the user to retry.
    if ( !('title' in req.body) || req.body.title.length <= 0 ){
        
        // Message.addError(req, 'Required Fields Not Provided');
        // return res.redirect('/add-post');

        return res.status(400).send({
            message: "Required data not provided",
            error: "Title Required",
        });
    }

    // Check what's actually IN the body
    const title = 'title' in req.body ? req.body.title : "";
    const tags = 'tags' in req.body ? req.bodhy.tags : "";
    const content = 'content' in req.body ? req.body.content : "";
    const published = 'published' in req.body ? req.body.published: false;

    // Get a unique slug by looking at the database
    // and generating one based on other blog posts
    return getUniqueSlug(title)
        .then((result) => {
            const slug = result;
            const now = new Date();

            return Post.create({
                title: title,
                slug: slug,
                content: content,
                tags: tags,
                published: published,
                datePublished: now,
                createdAt: now,
                updatedAt: now,
            });
        })
        .then((result) => {
            return res.status(200).send({
                message: "Thanks for the post!",
                result,
            });
        })
        .catch((err) => {
            let error;
            // If this is a sequelize error, we'll get the errors from an
            // array in the err variable.
            if (typeof err == typeof {} && 'errors' in err){
                error = err.errors;
            } else {
                error = err;
            }

            return res.status(400).send({
                message: "Error adding post",
                error,
            })
        });
};

// The edit POST function is passed the following information:
// The ID
// Slug
// Title
// Tags
// Content
const editPost = async (req, res, next) => {
    
    if (!('id' in req.body)){
        return res.status(400).send({
            message: "Required data not provided",
            error: "Id not provided",
        });
    }

    if ( !('title' in req.body) || req.body.title.length <= 0 ){
        
        // Message.addError(req, 'Required Fields Not Provided');
        // return res.redirect('/add-post');

        return res.status(400).send({
            message: "Required data not provided",
            error: "Title not provided",
        });
    }

    // Check what's actually IN the body
    const title = 'title' in req.body ? req.body.title : "";
    const tags = 'tags' in req.body ? req.bodhy.tags : "";
    const content = 'content' in req.body ? req.body.content : "";
    const published = 'published' in req.body ? req.body.published: false;

    const now = new Date();

    let blogPost;
    let slug;

    return getBlogPostById(req.body.id)
        .then((result) => {
            blogPost = {
                ...result,
            };
            return getUniqueSlug(title, result.slug);
        })
        .then((result) => {
            slug = result;

            return Post.update({
                title: title,
                slug: slug,
                content: content,
                tags: tags,
                updatedAt: now,
                published: published,
            },{
                where: {
                    id: req.body.id,
                },
            });
        })
        .then((result) => {
            return res.status(200).send({
                id: blogPost.id,
                slug: slug,
                title: title,
                tags: tags,
                content: content,
                dateUpdated: now,
                datePublished: blogPost.datePublished,
            });
        })
        .catch((err) => {
            res.status(400).send({
                error: "Error Editing Post",
                message: err,
            });
        });
};

module.exports = {
    getPostList,
    addNewPost,
    editPost,
};