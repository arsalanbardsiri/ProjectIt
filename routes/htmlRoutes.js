const express = require('express');
const { User, StudyRoom } = require('../models');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const studyRoomData = await StudyRoom.findAll({
            include: [{ model: User }]
        });
        const studyRooms = studyRoomData.map(room => room.get({ plain: true }));
        res.render('index', { studyRooms });  // This will render the index.handlebars template with study room data
    } catch (err) {
        res.status(500).json(err);
    }
});

// Additional routes can be added for other templates/views as needed

module.exports = router;
