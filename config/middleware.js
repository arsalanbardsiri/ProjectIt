function withAuth(req, res, next) {
    if (!req.session.user) {
        res.status(401).json({ message: "Not authorized." });
    } else {
        next();
    }
}

module.exports = withAuth;
