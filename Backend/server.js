const express = require('express')

// for socket
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors')

const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["https://voyarav1.netlify.app", "http://localhost:5173",]
    }
});
const Message = require("./models/messageModel");

const PORT = 8080
const tripController = require("./controllers/tripController");
const path = require("path");
app.use(express.json())

const { setServers } = require("node:dns/promises")
setServers(["1.1.1.1", "8.8.8.8"]);

app.use(cors({
    origin: ["https://voyarav1.netlify.app", "http://localhost:5173",],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}))

// db call
const connectDB = require('./db/connectDB.js')
connectDB()

// authentication for login or signup route
const auth = require('./controllers/authentication.js')

const messages = require('./controllers/messages.js')
app.use('/', messages)

const searchController = require('./controllers/searchContoller.js')
app.use('/', searchController)

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// trip controller
app.use("/", tripController);

app.use('/', auth)

const onlineUsers = new Map();

io.on("connection", (socket) => {
    // Register logged in user
    socket.on("registerUser", (userId) => {
        onlineUsers.set(userId, socket.id);
    });
    // One-to-one message
    socket.on("sendMessage", async (data) => {
        const newMessage = await Message.create({
            sender: data.senderId,
            receiver: data.receiverId,
            message: data.message
        });
        const receiverSocket = onlineUsers.get(data.receiverId);
        if (receiverSocket) {
            io.to(receiverSocket).emit("receiveMessage", newMessage);
        }
        socket.emit("receiveMessage", newMessage);
    });
    socket.on("disconnect", () => {
        for (const [userId, socketId] of onlineUsers) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
    });
});
server.listen(PORT, () => {
    console.log(`server is running at ${PORT}`);
})

