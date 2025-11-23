function withAuth(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        //second too /views/error.handlebars instead of a res.json
        return res.render('error', { message: "User not authenticated" });
        // res.status(403).json({ message: "Not authorized." });
    }
}

module.exports = withAuth;
