const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');
const path = require('path');
const handlebars = require('handlebars');
const hbsLayouts = require('handlebars-layouts');

handlebars.registerHelper(hbsLayouts(handlebars));

require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up Handlebars for templating
const expressHandlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  handlebars: handlebars,
  helpers: handlebars.helpers
});

app.engine('handlebars', expressHandlebarsInstance.engine);
app.set('view engine', 'handlebars');

// Session configuration
const sess = {
  secret: process.env.SESSION_SECRET,
  store: new SequelizeStore({ db: sequelize }),
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true }
};

app.use(session(sess));

// Define routes
app.use('/api', require('./routes/apiRoutes'));
app.use('/', require('./routes/htmlRoutes'));

// 404 error handling
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// General error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Start server after syncing with the database
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
});
