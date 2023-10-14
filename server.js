const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./routes');
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
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Set up body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Use the routes
app.use(routes);

// Start the server after syncing the database models
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log('App listening on PORT ' + PORT);
    });
});
