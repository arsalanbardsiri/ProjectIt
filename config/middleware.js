function withAuth(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(403).json({ message: "Not authorized." });
    }
}

module.exports = withAuth;
