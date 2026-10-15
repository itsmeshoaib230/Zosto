
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        firebaseUid: {
            type: String,
            required: true,
            unique: true,
        },


        role: {
            type: String,
            enum: ["shopkeeper", "deliveryAgent"],
            required: true,
        },

        storeName: {
            type: String,
            trim: true,
            required: function () {
                return this.role === "shopkeeper";
            },
        },

        storeLocation: {
            type: String,
            trim: true,
            required: function () {
                return this.role === "shopkeeper";
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
