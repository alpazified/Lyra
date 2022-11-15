const { Schema, model, SchemaTypes } = require('mongoose');

const bannedUsers = Schema({
    users: { 
        type: SchemaTypes.Array,
        require: false
    },
    clientId: {
        type: SchemaTypes.String,
        require: true
    }
});

module.exports = model('bannedUsers', bannedUsers);