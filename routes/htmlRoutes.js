const router = require('express').Router();
const path = require('path');

router.get('/', (req, res) => {
    res.render('index'); // This renders the index.handlebars view
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/studyroom/:id', (req, res) => {
    // For now, just render the studyroom view. Later, you can fetch room details based on the id.
    res.render('studyroom');
});

module.exports = router;
