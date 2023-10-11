const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');  // This will render the index.handlebars template
});

module.exports = router;
