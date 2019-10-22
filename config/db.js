const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async() => {
    try{
        await mongoose.connectDB;

        console.log("DB Connected");
    }catch(err){
        console.error(err.message);
        process.exit();
    }
}
module.exports = connectDB;