const { default: mongoose } = require("mongoose");
const {loadEnvFile} = require('node:process')
loadEnvFile('.env')
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("DB connected Successfully");
    } catch (err) {
        console.error(err.message);
    }
};
module.exports = connectDB


