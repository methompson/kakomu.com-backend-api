// Internal Node imports
const http = require('http');

// External imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const uuidv4 = require('uuid/v4');

// Getting the database controller
const db = require('./controllers/db.js');

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

// Setting up the Session handler
app.use(session({
  secret: "2f0f4343-058e-4260-aabf-9448cced10ff4a7d512a-caee-4287-81d2-2cf25610109fa1204f88-0b88-42b3-829d-9e728edfd4764a5f1ffb-9592-4120-9eb7-c99aecde5cb6",
  resave: false,
  saveUninitialized: true,
  genid: (req) => {
    // console.log("session init", req.sessionID);
    return uuidv4();
  },
}));

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
