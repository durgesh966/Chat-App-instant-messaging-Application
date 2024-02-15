"use strict";
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

app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// for using the public folder file
const publicFolder = path.join(__dirname, 'public');
app.use(express.static(publicFolder));

// template engine
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

// Socket.IO setup (example)
io.on('connection', (socket) => {
    console.log('A user connected');
    // Handle socket events here
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
