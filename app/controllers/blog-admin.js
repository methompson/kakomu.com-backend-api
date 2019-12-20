const express = require('express');
const Sequelize = require('sequelize');
const slug = require('slug');

const Post = require('../models/post.js');
const Message = require('./message.js');

// This function queries the database for the provided
// slug, determines if it's unique and if not, returns a
// slug with a hyphenated number at the end
// oldSlug is the previous title, taken into account just in case
// the slug changes, but stays same enough to be included in the list
function getUniqueSlug(title, oldSlug = ""){
    let postSlug = slug(title);

    // Get all posts that start with the same slug
    const Op = Sequelize.Op;
    
    return Post.findAll({
        where:{
            slug: {
                [Op.like]: postSlug+"%",
            },
        },
    }).then( (result) => {
        // console.log("FindAll Prior to Add");

        //Collect the slugs in an array for easier comparisons
        let currentSlugs = [];
        result.forEach( (r) => {
            currentSlugs.push(r.dataValues.slug.toLowerCase());
            // console.log(r.dataValues.id, r.dataValues.title, r.dataValues.slug);
        });

        // console.log("currentSlugs", currentSlugs);

        //This loop assumes that a slug is already taken.
        let taken = true;
        let x = 1;
        while (taken){

            // This comparison resolves to true if the currently generated slug
            // Doesn't already exist in the array of similar slugs or
            // the generated slug is the same as the previous slug
            if (!currentSlugs.includes(postSlug) || postSlug === oldSlug){
                taken = false;
            } else {
                postSlug = slug(title) + '-' + x;
                ++x;
            }
        }

        // console.log("End Result", postSlug);
        return postSlug;

    }).catch( (err) => {
        console.log(err);
    });
}

// Displays the form to add a blog post.
exports.getAddPostPage = (req, res, next) => {
    //Define the title content and tags, each as empty strings
    let title, content, tags;
    title = content = tags = "";

    if (req.session.addpost){
        //Save myself some typing
        let a = req.session.addpost;

        title = a.title;
        content = a.content;
        tags = a.tags;
    }

    delete req.session.addpost;

    res.render('add-post', {
        errors:Message.getErrors(req),
        messages:Message.getMessages(req),
        title:title,
        blogcontent:content,
        tags:tags,
    });
};

// Adds a blog post to the database
// The function is async because of an await with
// The Post database object
exports.addNewPost = async (req, res, next) => {

    // Checks if required fields are not filled.
    // Right now, the required field is the Title 
    // If they are not filled, put all of the data into the session
    // then redirect to addPost page
    if ( 
        !req.body.title.length
    ){
        //Define addpost as an object
        req.session.addpost = {};

        // Save myself some typing
        let a = req.session.addpost;

        // Insert whatever data may have been passed in the body
        a.title = req.body.title || "";
        a.content = req.body.content || "";
        a.tags = req.body.tags || "";

        // Add an error message
        Message.addError(req, 'Required Fields Not Provided');
        return res.redirect('/add-post');
    }

    const title = req.body.title;
    const tags = req.body.tags;
    const content = req.body.content;

    // Get a unique slug by looking at the database
    // and generating one based on other blog posts
    let postSlug = await getUniqueSlug(title);

    // console.log("End Result", postSlug);

    // TODO - Generate a snippet
    // TODO - Check if slug already exists and increment if it does
    // TODO - Check if the result is an error
    // TODO - Restructure add post page to keep all data

    Post.create({
        title: title,
        slug: postSlug,
        content: content,
        tags: tags,
        published: false,
        datePublished: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }).then( (result) => {
        // console.log(result);

        Message.addMessage(req, "Post Added at /"+postSlug);

        res.redirect('/edit-post/'+postSlug);
    }).catch( (err) => {

        //Go through the error object, extract the messages
        err.errors.forEach( (e) => {
            Message.addError(req, e.message);
        });

        // console.log("db err", err);

        //Define addpost as an object
        req.session.addpost = {};

        // Save myself some typing
        let a = req.session.addpost;

        // Insert whatever data may have been passed in the body
        a.title = req.body.title || "";
        a.content = req.body.content || "";
        a.tags = req.body.tags || "";

        return res.redirect('/add-post');

    });

};

// Displays the post form with the values already filled in
// Post ID is blank unless explicitly called.
exports.getEditPostPage = (req, res, next) => {

    if (req.session.editPost){
        let e = req.session.editPost;

        return res.render('edit-post',{
            id: e.id,
            title: e.title,
            tags: e.tags,
            oldSlug: e.oldSlug,
            newSlug: e.newSlug,
            blogcontent:e.content,
            errors: Message.getErrors(req),
            messages: Message.getMessages(req),
        });
    }

    // Gets the one post with the slug.
    // The slug should be unique
    Post.findOne({
        where:{slug : req.params.slug},
    }).then( (result) => {
        // console.log(result);
        // console.log(result.slug);
        // console.log(result.title);

        return res.render('edit-post', {
            id:result.id,
            title:result.title,
            tags:result.tags,
            oldSlug: result.slug,
            newSlug: result.slug,
            blogcontent:result.content,
            errors: Message.getErrors(req),
            messages: Message.getMessages(req),
        });
    }).catch( (err) => {
        console.log(err);
    });
};

// The edit POST function is passed the following information:
// The ID
// The old Slug
// Slug
// Title
// Tags
// Content
// The function needs to check that the title exists and make a unique slug
exports.editPost = async (req, res, next) => {
    // console.log(req.body);

    let postSlug = req.body.newSlug;
    
    // Check if the old slug and new slug aren't the same
    if (req.body.oldSlug != req.body.newSlug){
        // If they aren't the same, find a unique slug, taking into account
        // that the old slug may also appear in the results
        postSlug = await getUniqueSlug( req.body.newSlug, req.body.oldSlug );
    }

    const title = req.body.title;
    const tags = req.body.tags;
    const content = req.body.content;

    // console.log("The Unique Slug", postSlug);

    Post.update({
        title: title,
        slug: postSlug,
        content: content,
        tags: tags,
        updatedAt: Date.now(),
    },{
        where:{
            id: req.body.id,
        }
    }).then( (result) => {
        Message.addMessage(req, "Post Successfully Updated");
        return res.redirect('/edit-post/'+postSlug);
    }).catch( (err) => {
        Message.addError(req, err);
        return res.redirect('/edit-post/'+req.body.oldSlug);
    });
};