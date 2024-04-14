// const express = require('express');
// const exphbs = require('express-handlebars');
// const apiRoutes = require('./routes/apiRoutes');
// const htmlRoutes = require('./routes/htmlRoutes');
// const sequelize = require('./config/connection');
// const passport = require('./config/passport');
// const session = require('express-session');
// const SequelizeStore = require('connect-session-sequelize')(session.Store);
// const sharedsession = require('express-socket.io-session');
// const db = require('./models');


// const app = express();
// const PORT = process.env.PORT || 3001;

// const http = require('http').createServer(app);
// const io = require('socket.io')(http);

// // Middleware for body parsing
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Static directory
// app.use(express.static("public"));

// // Set up Handlebars as the default templating engine.
// app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');

// // Set up sessions with Sequelize
// const sess = {
//     secret: process.env.SESSION_SECRET,
//     store: new SequelizeStore({
//         db: sequelize
//     }),
//     resave: false,
//     saveUninitialized: true,
//     cookie: {}
// };

// const expressSess = session(sess);

// app.use(expressSess);

// // Initialize passport and the express session and tell Passport to use session to keep our user logged in
// app.use(passport.initialize());
// app.use(passport.session());

// // Share session with io sockets
// io.use(sharedsession(expressSess, {
//     autoSave: true
// }));

// // Add this Socket.io middleware for authentication:
// // io.use((socket, next) => {
// //     console.log('Socket connection attempt. Session data:', socket.request.session);
// //     if (socket.request.session && socket.request.session.userId) {
// //         return next();
// //     }
// //     return next(new Error('Authentication error'));
// // });


// // Routes
// app.use('/api', apiRoutes);
// app.use('/', htmlRoutes);

// io.on('connection', (socket) => {
//     console.log(`User ${socket.id} connected`);
//     console.log("Session Data:", socket.request.session);

//      // Join a specific room
//      socket.on('join room', (roomId) => {
//         socket.join(roomId);
//         console.log(`User ${socket.id} joined room ${roomId}`);
//     });

//     // Handle receiving a chat message
//     socket.on('chat message', async (msg, roomId) => {
//         try {
//             // Save message to database
//             const newMessage = await db.Chat.create({
//                 message: msg,
//                 userId: socket.request.session.passport.user.id,
//                 studyRoomId: roomId
//             });
//             // Emit the message to the same room
//             io.to(roomId).emit('chat message', { 
//                 user: socket.request.session.passport.user.email, 
//                 message: msg, 
//                 timestamp: new Date().toLocaleString() 
//             });
//         } catch (error) {
//             console.error('Error handling chat message:', error);
//         }
//     });
// });


// // Sync the database and then start the server
// sequelize.sync({ force: false }).then(() => {
//     http.listen(PORT, () => {
//         console.log('App listening on PORT ' + PORT);
//     });
// });




const express = require('express');
const exphbs = require('express-handlebars');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
const sequelize = require('./config/connection');
const passport = require('./config/passport');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// const sharedsession = require('express-socket.io-session');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', function() {
  console.log(`Server is running on port ${PORT}`);
});

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

const expressSess = session(sess);
app.use(expressSess);

// Initialize passport and the express session and tell Passport to use session to keep our user logged in
app.use(passport.initialize());
app.use(passport.session());

// Share session with io sockets
// io.use(sharedsession(expressSess, { autoSave: true }));

// Routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

io.use((socket, next) => {
    expressSess(socket.request, {}, next);
});

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);
    console.log("Session Data:", socket.request.session);

    if (!socket.request.session.passport || !socket.request.session.passport.user) {
        console.error('Session or user data not found in socket.request.session');
        return;
    }

    socket.on('chat message', async (msg, roomId) => {
        console.log('Received message from client:', msg);
        try {
            const newMessage = await db.Chat.create({
                message: msg,
                userId: socket.request.session.passport.user.id,
                studyRoomId: roomId
            });
            // Replace the following line:
            // io.to(roomId).emit('chat message', { 
            //     user: socket.request.session.passport.user.email, 
            //     message: msg, 
            //     timestamp: new Date().toLocaleString() 
            // });

            // With this line to emit to all clients:
            io.emit('chat message', {
                user: socket.request.session.passport.user.email, 
                message: msg, 
                timestamp: new Date().toLocaleString()
            });

        } catch (error) {
            console.error('Error handling chat message:', error);
        }
    });
});

sequelize.sync({ force: false }).then(() => {
    http.listen(PORT, () => {
        console.log('App listening on PORT ' + PORT);
    });
});
