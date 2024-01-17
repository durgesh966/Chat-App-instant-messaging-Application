const express = require('express');
const Router = express.Router();

Router.get("/profile", (req, res) => {
    const user = req.session.user;
    if (!user) {
        res.redirect("/");
        return;
    }
    const userData = {
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
    };
    res.render("./profile/profile", {userData});
});


module.exports = Router;
