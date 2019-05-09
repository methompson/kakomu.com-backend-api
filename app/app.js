// Internal Node imports
const http = require('http');
const path = require('path');

// External imports
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const uuid = require('uuid/v4');

// Defining the routes
const blogAdminRoutes = require('./routes/blog-admin.js');
const blogRoutes = require('./routes/blog.js');

// Getting the database controller
const db = require('./controllers/db.js');

//Getting the Message Controller
const message = require('./controllers/message.js');

// Setting the timezone
process.env.TZ = "America/Chicago";

// Creating the express app
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

// Registering middlewares for later use
// Setting up the path for static files (e.g. css and js filies)
app.use( express.static( path.join(__dirname, 'public') ) );
// Setting up the body parser for getting form data, etc.
app.use( bodyParser.urlencoded({ extended: false }) );
// Setting up the Session handler
app.use( session({
    secret: "2f0f4343-058e-4260-aabf-9448cced10ff4a7d512a-caee-4287-81d2-2cf25610109fa1204f88-0b88-42b3-829d-9e728edfd4764a5f1ffb-9592-4120-9eb7-c99aecde5cb6",
    resave: false,
    saveUninitialized: true,
    genid: (req) => {
        console.log("session init", req.sessionID);
        return uuid();
    },
}) );

//Initializing the messaging system
app.use('/', message.initMessages);

app.use('/', (req, res, next) => {
    // message.addMessage(req, "Message!");
    // message.addError(req, "Error!");
    next();
});

app.use('/', (req, res, next) => {
    console.log( message.getMessages(req) );
    next();
});

// Routes involving administration of the page
app.use(blogAdminRoutes);

// Routes involving viewing the content of the page
app.use(blogRoutes);

// 404 Error
app.use('/:path', (req, res, next) => {
    let path = req.params.path;
    // res.status(404).send("<h1>" + path + " Not Found</h1>");
    res.status(404).render('404', {path: path});
});

const server = http.createServer(app);

db.sync()
    .then( (result) => {
        // console.log(result);
        console.log("DB Synced");
        server.listen(3000);
    }).catch( (err) => {
        console.log(err);
    });