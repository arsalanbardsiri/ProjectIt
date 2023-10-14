const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const passport = require('./config/passport');  // Adding passport for authentication
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Set up sessions
const sess = {
    secret: process.env.SESSION_SECRET,
    store: new SequelizeStore({
        db: sequelize
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {}
};

app.use(session(sess));

// Use handlebars as the default template engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Set up body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Use the routes
require('./routes/apiRoutes')(app);  // Prefixing with /api for clarity
require('./routes/htmlRoutes')(app);

// Start the server after syncing the database models
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log('App listening on PORT ' + PORT);
    });
});
