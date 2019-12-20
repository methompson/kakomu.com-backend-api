const Sequelize = require('sequelize');

const Post = require('../models/post.js');
const Message = require('./message.js');

function getTotalPosts(){
    return Post.findAll({
        attributes: [ [Sequelize.fn('COUNT', Sequelize.col('*')), 'total'] ]
    }).then(  (result) => {
        return result[0].dataValues.total;
    }).catch( (err) => {
        console.log(err);
    });
}

exports.getBlogList = async (req, res, next) => {

    // Getting the posts per page.
    const limit = 5;

    // Getting the total number of posts
    let totalPosts = await getTotalPosts();
    let totalPages = Math.ceil(totalPosts/limit);

    // Calculating the Offset based upon the p value passed in the query
    let offset = 0;
    let page = 1;
    
    if (req.query.p){

        // Makes a check to determine if requested page is less than the 
        // total pages.
        page = req.query.p < totalPages ? req.query.p : totalPages;
        offset = (page - 1) * 5;
    }

    // Checks if the next page should be displayed
    let nextPage = true;
    if (page == totalPages){
        nextPage = false;
    }

    // Checks if the previous page should be displayed
    let prevPage = false;
    if (page > 1){
        prevPage = true;
    }

    console.log("Page", page);
    
    Post.findAll({
        limit: limit,
        offset: offset,
        order: [ ['datePublished', 'ASC'], ]
    }).then( (results) => {

        let posts = [];

        results.forEach( (p) => {
            posts.push({
                slug: p.dataValues.slug,
                title: p.dataValues.title,
                tags: p.dataValues.tags,
                content: p.dataValues.content,
                date: p.dataValues.datePublished,
            });
        });

        // console.log(posts.length, posts);
        
        res.render('home', {
            errors:Message.getErrors(req),
            messages:Message.getMessages(req),
            posts: posts,
            pageNum: page,
            nextPage: nextPage,
            prevPage: prevPage,
        });

    }).catch( (err) => {
        console.log(err);
    });

}

exports.getBlogPost = (req, res, next) => {
    Post.findOne({
        where:{slug: req.params.slug},
    }).then( (result) => {

        // console.log("getBlogPost result",result);

        if (!result){
            return res.render('error', {
                errors:Message.getErrors(req),
                messages:Message.getMessages(req),
            });
        }

        let blogPost = {
            slug: result.dataValues.slug,
            title: result.dataValues.title,
            tags: result.dataValues.tags,
            content: result.dataValues.content,
            date: result.dataValues.datePublished,
        };

        console.log(blogPost);

        // console.log(typeof result.dataValues.datePublished);

        return res.render('blog-post', {
            errors: Message.getErrors(req),
            messages: Message.getMessages(req),
            blogPost: blogPost
        });

        // res.send('<h1>Title: ' + req.params.slug + "</h1>");

    }).catch( (err) => {

    });
    
};