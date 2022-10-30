require('dotenv').config();
const mongoose = require('mongoose');
module.exports = {
    init: () => {

        // Connects to the database
        mongoose.connect(process.env.MONGO_URL, {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).catch((err) => {
            console.log('\x1b[31m%s\x1b[0m', '❌ | MONGO DB ERROR\n\n' + err)
        });

        mongoose.Promise = global.Promise;

        // Catches an error and logs it
        mongoose.connection.on('err', err => {
            console.log('\x1b[31m%s\x1b[0m', '❌ | MONGO DB ERROR\n\n' + err)
        });

        // Logs disconnect messages
        mongoose.connection.on('disconnected', () => {
            console.log('\x1b[31m%s\x1b[0m', '❌ | DISCONNECTED FROM THE DATABASE')
        });

        // Logs connection messages
        mongoose.connection.on('connected', () => {
            console.log('\x1b[32m%s\x1b[0m', '✅ | Successfully CONNECTED TO THE DATABASE')
        });
    },
};