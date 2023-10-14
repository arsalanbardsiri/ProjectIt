const router = require('express').Router();
const { ensureAuthenticated } = require('../config/middleware');  // <-- Import the middleware
const { StudyRoom, User } = require('../models');

// Render Landing Page (index.handlebars)
router.get('/', (req, res) => {
    res.render('index');
});

// Render Registration Page (register.handlebars)
router.get('/register', (req, res) => {
    res.render('register');
});

// Render Login Page (login.handlebars)
router.get('/login', (req, res) => {
    res.render('login');
});

// Render Dashboard (dashboard.handlebars)
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.user });
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
        res.render('studyroom', { room });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
