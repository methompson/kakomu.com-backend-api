// Internal Node imports
const http = require('http');

// External imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Setting the timezone
process.env.TZ = "America/Chicago";

// Creating the express app
const app = express();

// global.jwtSecret = uuidv4();
global.jwtSecret = "secret";

// Setting up the body parser for getting form data, etc.
// app.use( bodyParser.urlencoded({ extended: false }) );

// Setting up the body parser for getting JSON data
app.use( bodyParser.json() );

// Getting routes
const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/blog-admin');
const authRoutes = require('./routes/auth');

app.use('/api/blog', cors(), blogRoutes);
app.use('/api/admin', cors(), adminRoutes);
app.use('/api/auth', cors(), authRoutes);

// Fallback routes

// Home page
app.get('/', (req, res, next) => {
  res.send("<h1>Welcome to my blog!!</h1>")
});

// 404 Error
app.use('/:path', (req, res, next) => {
  let path = req.params.path;
  res.status(404).send("<h1>" + path + " Not Found</h1>");
  // res.status(404).render('404', {path: path});
});

const server = http.createServer(app);
server.listen(3000);
