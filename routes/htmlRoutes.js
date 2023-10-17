const router = require('express').Router();
const { StudyRoom, User } = require('../models');  // Import the models
const withAuth = require('../config/middleware'); // Import the middleware

// Render the home page with a list of all study rooms
router.get('/', async (req, res) => {
    try {
        const studyRooms = await StudyRoom.findAll({
            include: { model: User, attributes: ['username'] }
        });
        const rooms = studyRooms.map(room => room.get({ plain: true }));
        res.render('index', { studyRooms: rooms });
    } catch (err) {
        res.status(500).render('error', { message: err.message });
    }
});

// Render Registration Page (register.handlebars)
router.get('/register', (req, res) => {
    res.render('register');
});

// Render Login Page (login.handlebars)
router.get('/login', (req, res) => {
    res.render('login');
});

// Render Dashboard (dashboard.handlebars) - Protected by withAuth middleware
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const studyRooms = await StudyRoom.findAll({
            include: { model: User, attributes: ['username'] }
        });
        const rooms = studyRooms.map(room => room.get({ plain: true }));
        res.render('dashboard', {
            username: req.user.username,
            email: req.user.email,
            studyRooms: rooms
        });
    } catch (err) {
        res.status(500).render('error', { message: err.message });
    }
});

// Render a Specific Study Room (studyroom.handlebars)
router.get('/studyroom/:id', async (req, res) => {
    try {
        const studyRoomData = await StudyRoom.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        if (!studyRoomData) {
            res.status(404).json({ message: 'No study room found with that id!' });
            return;
        }

        const room = studyRoomData.get({ plain: true });
        console.log(room);
        res.render('studyroom', { room });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
