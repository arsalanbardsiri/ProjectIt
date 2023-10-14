const express = require('express');
const { User, StudyRoom } = require('../models');
const router = express.Router();

// Test Route
router.get('/test', (req, res) => {
    res.json({ message: 'API is working' });
});

// User Registration
router.post('/register', async (req, res) => {
    try {
        const userData = await User.create(req.body);
        req.session.save(() => {
            req.session.userId = userData.id;
            res.json(userData);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { email: req.body.email } });
        if (!userData || !userData.checkPassword(req.body.password)) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }
        req.session.save(() => {
            req.session.userId = userData.id;
            res.json({ user: userData, message: 'Logged in successfully' });
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

// Create a StudyRoom
router.post('/studyrooms', async (req, res) => {
    try {
        const studyRoomData = await StudyRoom.create({
            ...req.body,
            userId: req.session.userId
        });
        res.json(studyRoomData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Get all StudyRooms
router.get('/studyrooms', async (req, res) => {
    try {
        const studyRooms = await StudyRoom.findAll();
        res.json(studyRooms);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
