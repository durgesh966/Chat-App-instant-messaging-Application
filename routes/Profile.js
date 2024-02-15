const express = require('express');
const Router = express.Router();
const User = require('../db/scheema/User');

Router.get("/profile", async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) {
            return res.redirect("/");
        }
        const userData = {
            name: user.name,
            phone: user.phone,
            profileImage: user.profileImage
        };
        const userDb = await User.findOne({ phone: userData.phone });
        if (!userDb) {
            return res.status(404).send("User not found");
        }
        res.render("profile/profile", { userData, userDb });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

Router.get("/edit-profile", async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) {
            return res.redirect("/");
        }
        const userDb = await User.findOne({ phone: user.phone }).exec();
        console.log("User Data:", userDb);
        if (!userDb) {
            return res.status(404).send("User not found");
        }
        res.render("profile/editProfile", { userDb });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



Router.get("/add-bio", (req, res) => {
    const user = req.session.user;
    if (!user) {
        res.redirect("/");
        return;
    }
    const userData = {
        name: user.name,
        phone: user.phone,
        profileImage: user.profileImage
    };
    res.render("./profile/addBio", { userData });
});

Router.post("/add-bio/:phone", async (req, res) => {
    const phone = req.params.phone;
    const bio = req.body.bio;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { phone: phone },
            { $set: { bio: bio } },
            { new: true }
        );
        if (updatedUser) {
            res.redirect("/add-bio")
        } else {
            console.log('User not found');
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = Router;
