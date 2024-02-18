const express = require("express");
const app = express();
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require("cors");
const morgan = require('morgan')
require('colors');
require('dotenv').config({ path: "./config/.env" });
const port = process.env.PORT || 9000;
require("./db/connection/connection");
const server = http.createServer(app);
const io = socketIO(server);

app.use(morgan('tiny'));
// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static('uploads'));

// for using the public folder file
const publicFolder = path.join(__dirname, 'public');
app.use(express.static(publicFolder));

// template engine
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');


// require user model
const User = require("./db/scheema/User")
// creat name space
const userSpace = io.of("/user-namespace");

userSpace.on("connection", async function (socket) {
    console.log("User Connected");
    const userId = socket.handshake.auth.token;
    await User.findByIdAndUpdate(userId, { $set: { status: '1' } });

    socket.on("disconnect", async function () {
        console.log("User Disconnected");
        const userId = socket.handshake.auth.token;
        await User.findByIdAndUpdate(userId, { $set: { status: '0' } });
    });
});


// Routes
app.use('/', require('./routes/loginLogout'));
app.use('/', require('./routes/Profile'));
app.use('/', require('./routes/chat'));
app.use('/', require('./routes/home'));

// Start the server
server.listen(port, () => {
    console.log(`Server listening on port ${port}`.bgGreen.black.bold);
});
