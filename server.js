const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3001;

const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Middleware for body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static directory
app.use(express.static("public"));

// Set up Handlebars as the default templating engine.
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Set up sessions with Sequelize
const sess = {
    secret: process.env.SESSION_SECRET,
    store: new SequelizeStore({
        db: sequelize
    }),
    resave: false,
    saveUninitialized: true,
    cookie: {}
};
app.use(session(sess));

// Initialize passport and the express session and tell Passport to use session to keep our user logged in
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Sync the database and then start the server
sequelize.sync({ force: false }).then(() => {
    http.listen(PORT, () => {
        console.log('App listening on PORT ' + PORT);
    });
});
