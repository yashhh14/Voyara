const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        destination: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        coverImage: {
            type: String,
            required: true
        },
        days: [
            {
                dayNo: {
                    type: Number,
                    required: true
                },
                location: {
                    type: String,
                    required: true
                },
                hotel: {
                    type: String
                },
                caption: {
                    type: String
                },
                expenses: {
                    type: Number,
                    default: 0
                },
                images: [
                    {
                        type: String
                    }
                ]
            }
        ],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                text: String,
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        shares: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
    }
);

const Trip = mongoose.model("trip", tripSchema);

module.exports = Trip;