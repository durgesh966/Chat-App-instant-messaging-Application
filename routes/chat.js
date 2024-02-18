const express = require('express');
const session = require('express-session');
const Router = express.Router();

const auth = require("../middleware/auth");
 
Router.get("/chat", auth.isLogin, (req, res) => {
    const user = req.session.user;
    const userData = {
        name: user.name,
        phone: user.phone,
        profileImage: user.profileImage
    };
    if(!userData){
        res.redirect("/")
    }
    if (!user) {
        res.redirect("/home");
    } else {
        res.render("./chat/chat", { userData });
    }
});

module.exports = Router;
