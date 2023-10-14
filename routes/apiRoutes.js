const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User, StudyRoom } = require('../models');

// User registration route
router.post('/users/register', async (req, res) => {
    try {
        const existingUser = await User.findOne({ where: { email: req.body.email } });

        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        req.session.user = {
            id: newUser.id,
            username: newUser.username
        };

        res.status(201).json({ message: "Registration successful!" });

    } catch (error) {
        res.status(500).json({ message: "Error registering user.", error });
    }
});

// User login route
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });

        console.log("Stored Hashed Password:", user.password);
        console.log("Provided Password:", req.body.password);

        if (!user || !await user.checkPassword(req.body.password)) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        req.session.user = {
            id: user.id,
            username: user.username
        };

        res.json({ message: "Login successful!" });

    } catch (error) {
        res.status(500).json({ message: "Error logging in.", error });
    }
});

// User logout route
router.post('/users/logout', (req, res) => {
    if (req.session.user) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

// Create a new study room
router.post('/studyrooms', async (req, res) => {
    try {
        const newRoom = await StudyRoom.create({
            topic: req.body.topic,
            description: req.body.description,
            userId: req.session.user.id  // assuming you store the userId in session after login
        });
        res.json(newRoom);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Fetch and return list of all study rooms
router.get('/studyrooms', async (req, res) => {
    try {
        const rooms = await StudyRoom.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });
        res.json(rooms);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Fetch details of a specific study room based on the id
router.get('/studyrooms/:id', async (req, res) => {
    try {
        const room = await StudyRoom.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        if (!room) {
            return res.status(404).json({ message: "Room not found." });
        }

        res.json(room);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
