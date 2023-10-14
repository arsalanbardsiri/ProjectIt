const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require('bcryptjs');

// Register a new user
router.post("/api/register", (req, res) => {
    db.User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(() => {
        res.json({ message: "Registration successful!" });
    })
    .catch(err => {
        console.log("Error during registration:", err);
        res.status(500).json({
            message: "Error registering user.",
            error: err.message
        });
    });
});

// Login
router.post("/api/login", (req, res) => {
    db.User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUser => {
        // Check if the user was found and if the password is correct
        if (!dbUser || !dbUser.checkPassword(req.body.password)) {
            return res.status(400).json({
                message: "Invalid email or password."
            });
        }

        // If user is valid, initiate the session and respond
        req.session.save(() => {
            req.session.userId = dbUser.id;

            return res.json({
                user: dbUser,
                message: "Login successful!"
            });
        });
    });
});

// Logout
router.post("/api/logout", (req, res) => {
    if (req.session.userId) {
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
