const express = require('express');
const session = require('express-session');
const Router = express.Router();
const User = require("../db/scheema/User");

Router.get("/home", (req, res) => {
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
    res.render("./chat/home", { userData });
});

module.exports = Router;
