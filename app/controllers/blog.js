const Post = require('../models/post.js');

/**
 * 
 * @param {Numbner} id The id of the blog post we wish to retrieve
 * @return {Promise} The result from the database query, either a database post or an error
 */
const getBlogPostById = async (id) => {
  if (  typeof id !== typeof 1
    ||  id < 0
  ) {
    throw "Invalid Post Id.";
  }

  return Post.findOne({
    where: {
      id
    },
  })
    .then((result) => {
      if (!result) {
        throw "Invalid Post Id";
      }

      return {
        id:             result.dataValues.id,
        slug:           result.dataValues.slug,
        title:          result.dataValues.title,
        tags:           result.dataValues.tags,
        content:        result.dataValues.content,
        datePublished:  result.dataValues.datePublished,
        dateUpdated:    result.dataValues.updatedAt,
        published:      result.dataValues.published,
      };
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

/**
 * 
 * @param {String} slug the slug we're searching for.
 * @return {Promise} The result from the database query, either a database post or an error
 */
const getBlogPostBySlug = async (slug = "") => {

  if (  typeof slug !== typeof ""
    ||  slug.length === 0
  ) {
    throw "Invalid Post Slug.";
  }

  return Post.findOne({
    where: {
      slug
    },
  })
    .then((result) => {
      if (!result) {
        throw "Invalid Post Slug.";
      }

      return {
        id:             result.dataValues.id,
        slug:           result.dataValues.slug,
        title:          result.dataValues.title,
        tags:           result.dataValues.tags,
        content:        result.dataValues.content,
        datePublished:  result.dataValues.datePublished,
        dateUpdated:    result.dataValues.updatedAt,
        published:      result.dataValues.published,
      };
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

/**
 * 
 * @param {Number} page The start page to query
 * @param {Number} limit The total posts per page (affects the starting page)
 * @return {Promise} The results from the database query or an error.
 */
const getBlogPostsByPage = async (page = 1, limit = 5) => {

  if (  typeof page !== typeof 1
    ||  typeof limit !== typeof 1
  ){
    throw "Invalid parameters provided";
  }

  offset = (page - 1) * limit;

  // findAll returns an array of post objects.
  return Post.findAll({
    limit,
    offset: offset,
    order: [
      ['datePublished', 'ASC'],
    ]
  })
    .then((results) => {
      const posts = [];

      // We cycle through the results and retrieve the relevant data that we need
      results.forEach((r) => {
        posts.push({
          id:             r.dataValues.id,
          slug:           r.dataValues.slug,
          title:          r.dataValues.title,
          tags:           r.dataValues.tags,
          content:        r.dataValues.content,
          datePublished:  r.dataValues.datePublished,
          dateUpdated:    r.dataValues.updatedAt,
          published:      r.dataValues.published,
        });
      });

      return posts;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};


const getTotalPosts = () => {
  return Post.findAll({
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.col('*')), 'total']
    ]
  })
    .then((result) => {
      return result[0].dataValues.total;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};


module.exports = {
  getBlogPostById,
  getBlogPostBySlug,
  getBlogPostsByPage,
  getTotalPosts,
};