const pool = require('../controllers/db.js');

const getBlogPostById_db = (id) => {
  return new Promise((resolve, reject) => {    

    if (  typeof id !== typeof 1
      ||  id < 0
    ){
      
      reject({
        status: 401,
        message: "Error Getting Post",
        error: "Invalid Post ID",
      });
    }

    pool.execute(`
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
      WHERE id = ?
      ORDER BY datePublished DESC
    `,
    [id],
    (err, results, fields) => {
      resolve({
        err,
        results,
        fields,
      });
    });
  });
};

const getBlogPostById = (req, res, next) => {
  const id = 'id' in req.params ? Number(req.params.id) : null;

  getBlogPostById_db(id)
    .then((results) => {
      if (results.err) {
        throw {
          status: 500,
          message: "Server Error",
          error: "Database Server Error",
        };
      }

      return results.results;
    })
    .then((results) => {
      res.status(200).send(results[0]);
    })
    .catch((err) => {
      // We might reach this area from a promise that I didn't throw or reject
      // We're just going to display a generic message if that's the case
      let error;
      if (typeof err == typeof {}){
        error = err;
      } else {
        error = {
          status: 500,
          message: "Error getting post",
          error: err,
        };
      }

      console.log(error);

      return res.status(error.status).send({
        message: error.message,
        error: error.error,
      });
    });
};

const getBlogPostBySlug = (req, res, next) => {
  const slug = 'slug' in req.params ? req.params.slug : "";

  return new Promise((resolve, reject) => {
    if (  typeof slug !== typeof ""
      ||  slug.length === 0
    ) {
      reject({
        status: 401,
        message: "Error Getting Post",
        error: "Invalid Slug",
      });
    }

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
      WHERE published = true
      AND slug = ?
      ORDER BY datePublished DESC
    `,
    [slug],
    (err, results, fields) => {
      if (err) {
        reject({
          status: 500,
          message: "Server Error",
          error: "Database Server Error",
        });
        return;
      }

      resolve(results);
    });
  })
    .then((results) => {
      console.log(results[0]);
      const data = results.length > 0 ? results[0] : {};
      res.status(200).json(data);
    })
    .catch((err) => {
      // We might reach this area from a promise that I didn't throw or reject
      // We're just going to display a generic message if that's the case
      let error;
      if (typeof err == typeof {}){
        error = err;
      } else {
        error = {
          status: 500,
          message: "Error getting post",
          error: err,
        };
      }

      return res.status(error.status).send({
        message: error.message,
        error: error.error,
      });
    });
};

const getBlogPostsByPage = (req, res, next) => {
  let pageNum;
  const limit = 10;
  return new Promise((resolve, reject) => {
    if ('pageNum' in req.params){
      pageNum = Number(req.params.pageNum);

      if (isNaN(pageNum)){
        pageNum = 1;
      }
    } else {
      pageNum = 1;
    }

    pool.execute(`
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
      WHERE published = true
      ORDER BY datePublished DESC
      LIMIT ?, ?
    `,
    [
      (pageNum - 1) * limit,
      limit,
    ],
    (err, results, fields) => {
      if (err) {
        reject({
          status: 500,
          message: "Server Error",
          error: "Database Server Error",
        });
        return;
      }

      resolve(results);
    });
  })
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((err) => {
      // We might reach this area from a promise that I didn't throw or reject
      // We're just going to display a generic message if that's the case
      let error;
      if (typeof err == typeof {}){
        error = err;
      } else {
        error = {
          status: 500,
          message: "Error getting post",
          error: err,
        };
      }

      return res.status(error.status).send({
        message: error.message,
        error: error.error,
      });
    });
};

const getBlogPostsByTag = (req, res, next) => {
  const tag = 'tag' in req.params ? req.params.tag : '';

  return new Promise((resolve, reject) => {
    if (tag.length <= 0){
      reject({
        status: 401,
        message: "Error Getting Post",
        error: "Tag not provided",
      });
    }

    pool.execute(`
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
      WHERE published = true
      AND tags LIKE ?
      ORDER BY datePublished DESC
    `,
    ['%' + tag + '%',],
    (err, results, fields) => {
      if (err) {
        reject({
          status: 500,
          message: "Server Error",
          error: "Database Server Error",
        });
        return;
      }

      resolve(results);
    });
  })
  .then((results) => {
    res.status(200).send(results);
  })
    .catch((err) => {
      let error;
      if (
            typeof err == typeof {}
        &&  'status' in err
        &&  'message' in err
        &&  'error' in err
      ){
        error = err;
      } else {
        error = {
          status: 500,
          message: "Error Retrieving Blog Posts",
          error: err,
        };
      }

      return res.status(error.status).send({
        message: error.message,
        error: error.error,
      });
    });
};

const getTotalPosts = () => {
  return new Proimse((resolve, reject) => {
    pool.execute(`
      SELECT COUNT(*)
      FROM posts
      WHERE published = true
    `,
    (err, results, fields) => {
      console.log("results", results);
      console.log("err", err);

      if (err) {
        reject(err);
        return;
      }

      resolve(results);
    });
  });
};

module.exports = {
  getBlogPostById_db,
  getBlogPostById,
  getBlogPostBySlug,
  getBlogPostsByPage,
  getBlogPostsByTag,
};