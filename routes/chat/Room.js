const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static("public"));

const botName = "DalluBot ";
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.emit("message", formatMessage(botName, "Welcome To Our Chat!"));
    socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} has joined the chat`));
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    if (user && user.room) {
      io.to(user.room).emit("message", formatMessage(user.username, msg));
    } else {
    }
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the chat`));
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

