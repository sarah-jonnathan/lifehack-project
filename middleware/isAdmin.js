const isAdmin = (req, res, next) => {
    if (req.session.currentUser.isAdmin === true) {
        next(); // keep calling the next middleware
    } else {
        res.redirect("../login"); // send the user to the login page
    }
}

module.exports = isAdmin;