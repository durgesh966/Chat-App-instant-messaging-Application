const express = require('express');
const session = require('express-session');
const Router = express.Router();
const Bcrypt = require("bcrypt");
const Upload = require('../controller/multer');
const User = require("../db/scheema/User");

Router.use(session({
    secret: 'my-key',
    resave: false,
    saveUninitialized: true
}));

Router.get("/", (req, res) => {
    res.render("./form/login");
});

Router.post('/signup', Upload.single('profileImage'), async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const profileImage = req.file ? req.file.filename : null;
        console.log(profileImage);
        const hashPassword = await Bcrypt.hash(password, 10);
        const result = await User.create({ name, email, hashPassword, profileImage });

        if (!result) {
            console.log("data not save");
        } else {
            console.log("Data Save");
            req.session.user = {
                name,
                email,
                profileImage
            };
        }

        res.redirect("/chat");
    } catch (error) {
        console.log(error);
    }
});

Router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const compare = user ? await Bcrypt.compare(password, user.hashPassword) : false;

        if (user && compare) {
            req.session.user = {
                name: user.name,
                email: user.email,
                profileImage: user.profileImage
            };
            res.redirect('/chat');
        } else {
            res.redirect('/', { error: 'invalid email or password' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('internal server error');
    }
});

Router.get("/chat", (req, res) => {
    const user = req.session.user;
    const userData = {
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
    };
    if(!userData){
        res.redirect("/")
    }
    if (!user) {
        res.redirect("/");
    } else {
        res.render("./chat/chatUi", { userData });
    }
});

module.exports = Router;
