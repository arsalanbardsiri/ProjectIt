// Require necessary npm packages
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connection');

// Set up the Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Set up sessions
const sess = {
    secret: process.env.SESSION_SECRET,
    store: new SequelizeStore({
        db: sequelize
    }),
    resave: false,
    saveUninitialized: false
};

//Routes
const htmlRoutes = require('./routes/htmlRoutes');
const apiRoutes = require('./routes/apiRoutes');

app.use('/', htmlRoutes);
app.use('/api', apiRoutes);
 

app.use(session(sess));

// Set up Handlebars.js view engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Set up Express app to handle data parsing and static directory
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Import routes (when you have them set up)
// const routes = require('./controllers');
// app.use(routes);

// Sync Sequelize models and then start the Express app
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log('App listening on PORT ' + PORT);
    });
});
