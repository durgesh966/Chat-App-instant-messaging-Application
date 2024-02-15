const express = require('express');
const session = require('express-session');
const Router = express.Router();
const User = require("../db/scheema/User");

Router.get("/home", async (req, res) => {
    const user = req.session.user;
    if (!user) {
        res.redirect("/");
        return;
    }
    const allUserData = await User.find({ phone: { $ne: user.phone } }).lean();
    const userData = {
        name: user.name,
        phone: user.phone,
        profileImage: user.profileImage
    };
    res.render("./chat/home", { userData, allUserData });
});


module.exports = Router;
