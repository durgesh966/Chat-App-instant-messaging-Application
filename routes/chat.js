const express = require('express');
const session = require('express-session');
const Router = express.Router();

const Chat = require('../db/scheema/Chat')

const auth = require("../middleware/auth");

Router.get("/chat", auth.isLogin, (req, res) => {
    const user = req.session.user;
    const userData = {
        name: user.name,
        phone: user.phone,
        profileImage: user.profileImage
    };
    if (!userData) {
        res.redirect("/")
    }
    if (!user) {
        res.redirect("/home");
    } else {
        res.render("./chat/chat", { userData });
    }
});

Router.post("/save_chat", auth.isLogin, async (req, res) => {
    try {
        let chat = new Chat({
            sender: req.body.userId,
            receiver: req.body.receiver_id,
            message: req.body.message
        });
        const newChat = await chat.save();
        res.status(200).send({ success: true, msg: 'Chat saved successfully!', data: newChat });
    } catch (error) {
        console.error("Error saving chat:", error);
        res.status(500).send({ success: false, msg: 'An error occurred while saving the chat.' });
    }
});

module.exports = Router;