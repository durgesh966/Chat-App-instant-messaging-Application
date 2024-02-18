const express = require('express');
const session = require('express-session');
const Router = express.Router();
const User = require("../db/scheema/User");

const auth = require("../middleware/auth");

Router.get("/home", auth.isLogin, async (req, res) => {
    const user = req.session.user;
    const successMessage = req.query.success;
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
    res.render("./chat/home", { userData, allUserData, successMessage  });
});


module.exports = Router;
