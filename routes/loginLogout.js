const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('../controller/multer');
const User = require('../db/scheema/User');

const auth = require("../middleware/auth");

const Router = express.Router();

// Session configuration
Router.use(session({
    secret: 'my-key',
    resave: false,
    saveUninitialized: true
}));

Router.get('/', auth.isLogout, (req, res) => {
    res.render('./form/login');
});

Router.get('/signup', auth.isLogout, (req, res) => {
    res.render('./form/signup');
});

Router.post('/signup', auth.isLogout, multer.single('profileImage'), async (req, res) => {
    try {
        const { name, phone, password } = req.body;
        const profileImage = req.file ? req.file.filename : null;

        const hashPassword = await bcrypt.hash(password, 10);
        const result = await User.create({ name, phone, hashPassword, profileImage });

        if (result) {
            req.session.user = {
                name,
                phone,
                profileImage
            };
            console.log('Data saved');
        } else {
            console.log('Data not saved');
        }

        res.redirect('/home');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

Router.post('/', auth.isLogout, async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ phone });
        if (user && await bcrypt.compare(password, user.hashPassword)) {
            req.session.user = {
                name: user.name,
                phone: user.phone,
                profileImage: user.profileImage
            };
            res.redirect('/home?success=Login+successful!');
        } else {
            res.render('./form/login', { error: 'Invalid phone or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// logout Route 
Router.post('/logout', auth.isLogin, async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal server error');
            } else {
                res.redirect('/');
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

module.exports = Router;
 