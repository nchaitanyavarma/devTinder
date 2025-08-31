const mongoose = require('mongoose');

const URI = 'mongodb+srv://nchaitanyavarma7:4hxQw4ZQ4mN8W5Nn@node.tmrp0ye.mongodb.net/devTinder'
const connectDB = async()=>{
    await mongoose.connect(URI)
}

module.exports = connectDB

