// Internal Node imports
const http = require('http');
const uuidv4 = require("uuid/v4");

// External imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Setting the timezone
process.env.TZ = "America/Chicago";

// Creating the express app
const app = express();

app.set('trust proxy', true);

// global.jwtSecret = uuidv4();
global.jwtSecret = "secret";

// Setting up the body parser for getting JSON data

// Getting routes
const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/blog-admin');
const authRoutes = require('./routes/auth');

const fileRoutes = require('./routes/files');

app.use('/api/blog', bodyParser.json(), cors(), blogRoutes);
app.use('/api/admin', bodyParser.json(), cors(), adminRoutes);
app.use('/api/auth', bodyParser.json(), cors(), authRoutes);

app.use('/api/files', cors(), fileRoutes);

// 404 Error
app.use('/:path', (req, res, next) => {
  let path = req.params.path;
  res.status(404).send("<h1>" + path + " Not Found.</h1>");
  // res.status(404).render('404', {path: path});
});

const server = http.createServer(app);
server.listen(3000);