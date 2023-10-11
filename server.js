// Import necessary modules
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connection');
require('dotenv').config(); // Load environment variables from .env file

const app = express(); // Create an instance of the Express app
const PORT = process.env.PORT || 3000; // Define the port

// Middleware setup
app.use(express.json());  // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request body
app.use(express.static('./public')); // Serve static files from the "public" directory

// Session configuration
const sess = {
  secret: process.env.SESSION_SECRET,  // Secret key from .env
  store: new SequelizeStore({          // Use Sequelize to store session data
    db: sequelize,
  }),
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,                    // Prevent client-side scripts from accessing the cookie
    // secure: true,                  // Uncomment this line when deploying over HTTPS
  }
};

app.use(session(sess)); // Apply the session middleware

// Route handling
app.use('/api', require('./routes/apiRoutes')); // API routes
app.use('/', require('./routes/htmlRoutes'));   // View routes

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// General error handler
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page (assumes you have an error.handlebars or similar view)
    res.status(err.status || 500);
    res.render('error');
});

// Sync Sequelize models, then start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
});
