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
        res.json({ message: "Registration successful!" });
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
        req.session.user_id = req.user.id; // Use req.user
        req.session.email = req.user.email; // Use req.user
        req.session.logged_in = true;
        // res.json({
        //     email: req.user.email,
        //     id: req.user.id
        // });
        return res.redirect('/dashboard');
    });
});

// Logout
router.post("/users/logout", (req, res) => {
    if (req.session.user_id) { // Change to user_id
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).send("No user session found");
    }
});


// Create a new study room
router.post('/studyrooms', async (req, res) => {
    try {
        const newRoom = await db.StudyRoom.create({
            topic: req.body.topic,
            description: req.body.description,
            userId: req.user.id
        });
        res.json(newRoom);
    } catch (error) {
        res.status(500).json(error);
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

module.exports = router;
