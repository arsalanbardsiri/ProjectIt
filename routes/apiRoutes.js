const express = require("express");
const router = express.Router();
const db = require("../models");
const passport = require('../config/passport');

// Register a new user
router.post("/users/register", (req, res) => {
    db.User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(() => {
        res.redirect('/login');
    })
    .catch(err => {
        res.status(500).json({
            message: "Error registering user.",
            error: err.message
        });
    });
});

// Login using Passport
router.post("/users/login", passport.authenticate("local"), (req, res) => {
    req.session.save(() => {
        req.session.userId = req.user.id;
        req.session.email = req.user.email;
        req.session.logged_in = true;
        return res.redirect('/dashboard');
    });
});

// Logout
router.post("/users/logout", (req, res) => {
    console.log("Logout route hit");
    console.log(`Received ${req.method} request at ${req.path}`);

    if (req.session.userId) {
        console.log("Session exists, attempting to destroy");
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).send("Internal Server Error");
            }
            console.log("Session destroyed");
            res.status(204).end(); // No content response
        });
    } else {
        console.log("No session found");
        res.status(404).send("No user session found");
    }
});


// Create a new study room
router.post('/studyrooms', async (req, res) => {
    try {
        const newRoom = await db.StudyRoom.create({
            name: req.body.topic,
            description: req.body.description,
            userId: req.user.id
        });
        // res.json(newRoom);
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).render('error', { message: err.message });
    }
});

// Fetch and return list of all study rooms
router.get('/studyrooms', async (req, res) => {
    try {
        const rooms = await db.StudyRoom.findAll({
            include: [
                {
                    model: db.User,
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
        const room = await db.StudyRoom.findByPk(req.params.id, {
            include: [
                {
                    model: db.User,
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

// Send a new message to a study room
router.post('/studyrooms/:id/messages', async (req, res) => {
    try {
        const newMessage = await db.Chat.create({
            message: req.body.message,
            userId: req.user.id,
            studyRoomId: req.params.id
        });
        res.json(newMessage);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get all messages from a specific study room
router.get('/studyrooms/:id/messages', async (req, res) => {
    try {
        const messages = await db.Chat.findAll({
            where: {
                studyRoomId: req.params.id
            },
            include: [
                {
                    model: db.User,
                    attributes: ['username']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: 50  // limit to the last 50 messages, for example
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
