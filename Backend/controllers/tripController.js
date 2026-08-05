const express = require("express");
const app = express.Router();
const upload = require("../middlewares/multer");
const authMiddleware = require("../middlewares/authMiddleware");
const Trip = require("../models/tripModel");
const User = require('../models/userModel.js')
require("dotenv").config();
const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET;
function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        return null;
    }
}
app.get("/trip/:id", async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id).populate("user", "userName profilePic");
        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }
        res.json(trip);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});
app.put("/updateProfile", authMiddleware, upload.single("profilePic"), async (req, res) => {
    try {
        const updatedData = {};
        if (req.body.userName?.trim()) {
            updatedData.userName = req.body.userName.trim();
        }
        if (req.body.bio !== undefined) {
            updatedData.bio = req.body.bio;
        }
        if (req.file) {
            updatedData.profilePic = req.file.filename;
        }
        const user = await User.findByIdAndUpdate(req.user.id,
            { $set: updatedData },
            {
                returnDocument: "after",
            }
        ).select("-password");
        res.json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}
);
app.put("/updatePrivacy", authMiddleware, async (req, res) => {
    try {
        const { isPublic } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { isPublic },
            { new: true }
        );
        res.json({
            success: true,
            user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});
app.post("/createTrip", upload.single("coverImage"),
    async (req, res) => {
        try {
            const trip = await Trip.create({
                title: req.body.title,
                destination: req.body.destination,
                coverImage: req.file ? req.file.filename : "",
                user: req.body.id
            });
            res.json(trip);
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    }
);
app.get('/trips', async (req, res) => {
    try {
        const trips = await Trip.find().populate(
            "user",
            "userName profilePic"
        );
        res.status(200).json(trips);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
})
app.get("/myTrips", async (req, res) => {
    // try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const trips = await Trip.find({ user: decoded.id }).populate("user", "userName profilePic");
        res.status(200).json(trips);
    // } catch (err) {
    //     res.status(500).json({
    //         message: err.message
    //     });
    // }
});
app.patch("/trip/:tripId/addDay", upload.array("images", 10),
    async (req, res) => {
        try {
            const images = req.files.map(file => file.filename);
            const trip = await Trip.findById(req.params.tripId);
            if (!trip) {
                return res.status(404).json({
                    message: "Trip not found"
                });
            }
            const newDay = {
                dayNo: trip.days.length + 1,
                location: req.body.location,
                hotel: req.body.hotel,
                caption: req.body.caption,
                expenses: Number(req.body.expenses),
                images: images
            };
            trip.days.push(newDay);
            await trip.save();
            res.status(200).json({
                message: "Day added successfully",
                trip
            });

        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    }
);

module.exports = app;