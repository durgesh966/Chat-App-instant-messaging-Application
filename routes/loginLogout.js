const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('../controller/multer');
const User = require('../db/scheema/User');

const Router = express.Router();

// Session configuration
Router.use(session({
    secret: 'my-key',
    resave: false,
    saveUninitialized: true
}));

Router.get('/', (req, res) => {
    res.render('./form/login');
});

Router.get('/signup', (req, res) => {
    res.render('./form/signup');
});

Router.post('/signup', multer.single('profileImage'), async (req, res) => {
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

Router.post('/', async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ phone });

        if (user && await bcrypt.compare(password, user.hashPassword)) {
            req.session.user = {
                name: user.name,
                phone: user.phone,
                profileImage: user.profileImage
            };
            // console.log(phone);
            res.redirect('/home');
        } else {
            res.render('./form/login', { error: 'Invalid phone or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error'); F
    }
});

module.exports = Router;
 