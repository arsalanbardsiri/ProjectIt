const { User } = require('../models');

// Error handler
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
};

// Check if the user is logged in
const checkAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).send('Not authenticated');
    }
    next();
};

// Attach user to request
const attachUserToRequest = async (req, res, next) => {
    if (req.session.userId) {
        try {
            const user = await User.findByPk(req.session.userId);
            req.user = user.get();
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
};

// 404 error handling
const notFoundHandler = (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
};

module.exports = {
    errorHandler,
    checkAuth,
    attachUserToRequest,
    notFoundHandler
};
