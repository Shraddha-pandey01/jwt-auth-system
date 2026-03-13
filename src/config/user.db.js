const mongoose = require("mongoose");

const connectDb = async(mongoUri) => {
    try {
        mongoose.connect(mongoUri);
        console.log('Database is connected successfully')
    } catch (error) {
        console.error('Error in database connection', error)
    }
}

module.exports = {
    connectDb
}