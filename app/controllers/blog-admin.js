const slug = require('slug');

const {getBlogPostById_db} = require('./blog.js');
const pool = require('../controllers/db.js');
const {makeError, makeErrorResponse, sendError, valsInBody} = require('./utilities.js');

// This function queries the database for the provided
// slug, determines if it's unique and if not, returns a
// slug with a hyphenated number at the end
// oldSlug is the title prior to an edit
// the slug changes, but stays same enough to be included in the list
const getUniqueSlug = (title, oldSlug = "") => {
  let postSlug = slug(title);

  // Get all posts that start with the same slug
  return new Promise((resolve, reject) => {
    pool.execute(`
      SELECT slug
      FROM posts
      WHERE slug LIKE ?
    `,
    [postSlug + "%"],
    (err, results, fields) => {
      if (err){
        reject(err);
      }
      // results is an array
      resolve(results);
    })
  })
    .then( (results) => {
      //Collect the slugs in an array for easier comparisons
      const currentSlugs = {};
      results.forEach( (r) => {
        const s = r.slug;
        currentSlugs[s] = s;
      });

      // The taken variable is used to get out of the while loop.
      // A unique slug will either be a regular slug or the slug with a number
      // appended to the end.
      // We iterate by 1 every loop to find a unique slug.
      let taken = true;
      let x = 1;
      while (taken){
        // This comparison resolves to true if the currently generated slug
        // Doesn't already exist in the array of similar slugs or
        // the generated slug is the same as the previous slug
        if (!(postSlug in currentSlugs) || postSlug === oldSlug) {
          taken = false;
        } else {
          postSlug = slug(title) + '-' + x;
          ++x;
        }
      }
      return postSlug;

    });
}

const getBlogPostBySlug = (req, res, next) => {
  req._admin = true;
  next();
};

// This gets the entire blog list, whether or not the posts are published
const getPostList = (req, res, next) => {
  return new Promise((resolve, reject) => {
    return pool.execute(`
      SELECT id,
        title,
        slug,
        content,
        snippet,
        tags,
        published,
        datePublished,
        author,
        updatedAt
      FROM posts
      ORDER BY datePublished DESC
    `,
      [],
      (err, results, fields) => {
        if (err) {
          reject({
            status: 500,
            message: "Database Server Error",
            error: err,
          });
          return;
        }

        resolve(results);
      });
  })
    .then((results) => {
      res.status(200).send(results);
    });
};

// Adds a blog post to the database
// The function is async because of an await with
// The Post database object
const addPost = (req, res, next) => {
  const post = {};
  const now = new Date();

  return new Promise((resolve, reject) => {
    // Check that the userId exists in the request object
    if (  !('_user' in req)
      ||  !('userId' in req._user)
      ||  typeof req._user.userId !== typeof 1
    ) {
      reject(makeError("Correct Data Not Provided", "Correct Data Not Provided", 500));
      return;
    }

    // Checks if required fields are not filled. Right now, the
    // required field is the Title. If there is no title or its not filled,
    // send an error 400 and get the user to retry.
    if (!('title' in req.body) || req.body.title.length <= 0) {
      reject(makeError("Required data not provided", "Title Required", 400));
      return;
    }
    resolve();
  })
    .then(() => {
      // Check what's actually IN the body
      post.title = 'title' in req.body ? req.body.title : "";
      post.tags = 'tags' in req.body ? req.body.tags : "";
      post.content = 'content' in req.body ? req.body.content : "";
      post.published = 'published' in req.body ? req.body.published : false;
      post.authorId = 'authorId' in req.body ? req.body.authorId : req._user.userId;

      if (!('datePublished') in req.body || !post.published){
        post.datePublished = new Date(0);
      } else {
        post.datePublished = now;
      }

      // Get a unique slug by looking at the database
      // and generating one based on other blog posts
      return getUniqueSlug(post.title);
    })
    .then((result) => {
      const slug = result;
      post.slug = slug;

      return new Promise((resolve, reject) => {
        pool.execute(`
          INSERT INTO posts (
            title,
            slug,
            content,
            tags,
            published,
            datePublished,
            createdAt,
            updatedAt,
            author)
          VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?
          )
        `,
          [
            post.title,
            post.slug,
            post.content,
            post.tags,
            post.published,
            post.datePublished,
            now,
            now,
            post.authorId,
          ],
          (err, results, fields) => {
            if (err) {
              reject(makeError("Database Server Error", err, 500));
              return;
            }

            resolve(results);
          });
      });
    })
    .then((result) => {
      let message;
      if (result.affectedRows > 0){
        message = {
          message: "New Post Added, Id " + result.insertId,
          post:{
            id: result.insertId,
            slug: post.slug,
          },
        };

      } else {
        message = {
          message: "No Post added"
        };
      }

      return res.status(200).json(message);
    })
    .catch((err) => {
      const error = makeErrorResponse(err);
      sendError(error, res);
      return;
    });
};

// The edit POST function is passed the following information:
// The ID
// Slug
// Title
// Tags
// Content
const editPost = (req, res, next) => {
  // We need to define several variables HERE so that we can use them in other
  // functions that don't share the first proimse's scope.
  const post = {};
  const now = new Date();

  return new Promise((resolve, reject) => {
    if (!valsInBody(req.body, ['id', 'title'])){
      reject(makeError("Required Data Not Provided", "Required Data Not Provided", 400));
      return;
    }

    // Get the id from the body for the next step
    post.id = Number(req.body.id);

    resolve();
  })
    .then(() => {
      return getBlogPostById_db(post.id);
    })
    .then((results) => {
      if (results.length < 1){
        throw makeError("Post Not Found", "Request Error", 400);
      }

      return results;
    })
    .then((oldPost) => {
      // Check what's actually in the body and set it to that or the old post
      post.title = 'title' in req.body ? req.body.title : oldPost.title;
      post.tags = 'tags' in req.body ? req.body.tags : oldPost.tags;
      post.content = 'content' in req.body ? req.body.content : oldPost.content;
      post.published = 'published' in req.body ? req.body.published : oldPost.published;

      // They sent the datePublished value with the edit
      if ('datePublished' in req.body){
        post.datePublished = req.body.datePublished;
      // They published the post, but datePublished wasn't set
      } else if (post.published && !oldPost.published){
        post.datePublished = now;
      // Already published, don't change the date
      } else if (post.published && oldPost.published) {
        post.datePublished = oldPost.datePublished;
      } else {
        post.datePublished = new Date(0);
      }

      return getUniqueSlug(post.title, oldPost.slug);
    })
    .then((result) => {
      post.slug = result;

      return new Promise((resolve, reject) => {
        pool.execute(`
          UPDATE posts
            SET title = ?,
            slug = ?,
            content = ?,
            tags = ?,
            updatedAt = ?,
            datePublished = ?,
            published = ?
          WHERE id = ?
        `,
        [
          post.title,
          post.slug,
          post.content,
          post.tags,
          now,
          post.datePublished,
          post.published,
          post.id,
        ],
        (err, results, fields) => {
          if (err) {
            reject(reject(makeError("Database Server Error", err, 500)));
            return;
          }

          resolve(results);
        });
      });
    })
    .then((result) => {
      res.status(200).send({
        message: "Post successfully updated",
        post,
      });
    })
    .catch((err) => {
      const error = makeErrorResponse(err);
      sendError(error, res);
      return;
    });
};

const deletePost = (req, res, next) => {
  // Do we have the proper values in the request?
  let id;
  return new Promise((resolve, reject) => {
    if (!('id' in req.body)) {
      reject(makeError("Required data not provided", "Id Required", 400));
      return;
    }

    if (req.body.id < 1){
      reject(makeError("Required data not provided", "Invalid Id", 400));
      return;
    }

    // We save the id for use in another scope.
    id = req.body.id;

    // Executing prepared SQL statement. This is a simple query for deleting
    // By ID.
    pool.execute(`
      DELETE FROM posts
      WHERE id = ?
    `,
    [
      req.body.id,
    ],
    (err, results, fields) => {

      if (err) {
        reject(makeError("Database Server Error", err, 500));
        return;
      }
      resolve(results);
    });
  })
    .then((result) => {
      // The affectedRows value lists how many rows were actually deleted.
      let message;
      if (result.affectedRows > 0){
        message = "Post successfully deleted";
      } else {
        message = "No Post deleted";
      }
      res.status(200).send({
        message,
        post: {
          id,
        }
      });
    })
    .catch((err) => {
      const error = makeErrorResponse(err);
      sendError(error, res);
      return;
    });
};

const changePublication = (req, res, next) => {
  // We may want an id value to persist between scopes.
  let id, publish;
  return new Promise((resolve, reject) => {
    // Do we have the proper values in the request?
    if (!('id' in req.body)) {
      reject(makeError("Required data not provided", "Id Required", 400));
      return;
    }

    if (req.body.id < 1){
      reject(makeError("Required data not provided", "Invalid Id", 400));
      return;
    }

    if (  !('publication' in req)
      ||  typeof req.publication !== typeof true
    ) {
      reject(makeError("Internal Server Error", "Improper Usage of changePublication", 500));
      return;
    }

    publish = req.publication;
    id = req.body.id;

    pool.execute(`
      UPDATE posts
      SET published = ?
      WHERE id = ?
    `,
    [
      publish,
      id,
    ],
    (err, results, fields) => {
      if (err) {
        reject(makeError("Database Server Error", err, 500));
        return;
      }

      resolve(results);
    });
  })
    .then((result) => {
      const message = "Post successfully " + (publish ? 'published' : 'unpublished');
      res.status(200).send({
        message,
      });
    })
    .catch((err) => {
      const error = makeErrorResponse(err);
      sendError(error, res);
      return;
    });
};

module.exports = {
    getPostList,
    addPost,
    editPost,
    deletePost,
    changePublication,
    getBlogPostBySlug,
};