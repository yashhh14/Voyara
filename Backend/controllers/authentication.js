const express = require('express')
const auth = express.Router()
const User = require('../models/userModel.js')
const jwt = require('jsonwebtoken')
require("dotenv").config();
const authMiddleware = require("../middlewares/authMiddleware");



//==> JWT Token creation
const secretKey = process.env.JWT_SECRET;
function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        return null;
    }
}
function generateToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: "1d" })
}
auth.get('/verify', (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    if (verifyToken(token)) {
        res.send("Access granted")
    }
    else res.send("error")
})
auth.get("/profile", authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);

});
//-->end of JWT 

auth.get("/friends", async (req, res) => {
    // try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const user = await User.findById(decoded.id).populate(
            "following",
            "userName profilePic"
        );
        console.log(user);
        res.json(user.following);
    // } catch (err) {
    //     res.status(500).json({
    //         message: err.message
    //     });
    // }
});

auth.post('/signup', async (req, res) => {
    try {
        await User.create(req.body)
        res.status(201).json({
            message: "user created successfully",
            user: req.body
        })
    } catch (err) {
        console.log(err.errmsg);
        res.json({
            error: err.errorResponse.keyValue["userName"] &&
                "userName already exists, Try new one"
        })
    }
})
auth.post("/followUser/:id", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const currentUserId = decoded.id;
        const targetUserId = req.params.id;
        if (currentUserId === targetUserId) {
            return res.status(400).json({
                message: "You cannot follow yourself."
            });
        }
        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (currentUser.following.includes(targetUserId)) {
            return res.json({
                message: "Already following"
            });
        }
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);
        await currentUser.save();
        await targetUser.save();
        res.json({
            message: "Followed successfully"
        });
    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});
auth.get("/userName/:id", async (req, res) => {
    const id = req.params.id
    const user = await User.findOne({ userName: id });
    if (user) {
        res.json({
            exists: true,
            message: "User Name Already Exists"
        });
    }
    else {
        res.json({
            exists: false,
            message: "Username is available"
        })
    }
});
auth.post('/login', async (req, res) => {
    try {
        const user_email = req.body.user_email
        const password = req.body.password
        const regX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|ai)$/
        if (regX.test(user_email)) {
            const userData = await User.findOne({ email: user_email })
            if (userData) {
                if (userData.password === password) {
                    const token = generateToken({
                        id: userData._id,
                        userName: userData.userName,
                        email: userData.email,
                        following: userData.following,
                        followers: userData.followers,
                        isPublic: userData.isPublic
                    });
                    res.json({
                        "message": "Login Success",
                        token
                    })
                }
                else {
                    res.json({
                        message: "incorrect password"
                    })
                }
            }
            else {
                res.json({
                    message: "email not found"
                })
            }
        }
        else if (user_email) {
            try {
                const userData = await User.findOne({ userName: user_email })
                if (userData) {
                    if (userData.password === password) {
                        const token = generateToken({
                            id: userData._id,
                            userName: userData.userName,
                            email: userData.email,
                            following: userData.following,
                            followers: userData.followers,
                            isPublic: userData.isPublic

                        });
                        res.json({
                            "message": "Login Success",
                            token
                        })
                    }
                    else {
                        res.json({
                            message: "incorrect password"
                        })
                    }
                }
                else {
                    res.json({
                        message: "userName not found"
                    })
                }
            } catch (err) {
                res.json({
                    message: "user Not exists or incorrect password"
                })
            }
        }
        else {
            res.json({
                message: "email or username not exists"
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
})
// auth.post("/login", async (req, res) => {
//     try {
//         const { user_email, password } = req.body;
//         const regX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|ai)$/;
//         const user = regX.test(user_email)? await User.findOne({ email: user_email }): await User.findOne({ userName: user_email });
//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found",
//             });
//         }
//         if (user.password !== password) {
//             return res.status(401).json({
//                 message: "Incorrect password",
//             });
//         }
//         const token = generateToken({
//             id: user._id,
//             userName: user.userName,
//             email: user.email,
//         });
//         res.json({
//             message: "Login Success",
//             token,
//         });
//     } catch (err) {
//         res.status(500).json({
//             message: err.message,
//         });
//     }
// });
module.exports = auth