const express = require("express");
const app = express.Router();
const Message = require("../models/messageModel");
const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET;
function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        return null;
    }
}
app.get("/messages/:friendId", async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = verifyToken(token);
    const myId = decoded.id;
    const friendId = req.params.friendId;
    const messages = await Message.find({
        $or: [
            {
                sender: myId,
                receiver: friendId
            },
            {
                sender: friendId,
                receiver: myId
            }
        ]
    }).sort({
        createdAt: 1
    });
    res.json(messages);
});
module.exports = app;