const express = require("express");
const app = express.Router();
const Trip = require("../models/tripModel.js");
const User = require('../models/userModel.js')
const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET;
function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        return null;
    }
}

app.get("/search", async (req, res) => {
    try {
        const keyword = req.query.q;
        const users = await User.find({
            userName: {
                $regex: keyword,
                $options: "i"
            }
        }).select("userName profilePic followers following ");
        const trips = await Trip.find({
            $or: [
                {
                    title: {
                        $regex: keyword,
                        $options: "i"
                    }
                },
                {
                    destination: {
                        $regex: keyword,
                        $options: "i"
                    }
                }
            ]
        }).populate(
            "user",
            "userName profilePic follwers following"
        );
        res.json({
            users,
            trips
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

app.get("/search/:id", async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    const trips = await Trip.find({
        user: req.params.id
    });
    console.log(user,trips);
    res.json({
        user,
        trips
    });
});
app.get("/friendsPosts", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const currentUser = await User.findById(decoded.id);
        const posts = await Trip.find({
            user: {
                $in: currentUser.following
            }
        })
            .populate("user", "userName profilePic")
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = app;

