const { Schema, model, SchemaTypes } = require('mongoose');

const caseSchema = Schema({
    guildId: {
        type: SchemaTypes.String,
        default: null
    },
    moderatorId: {
        type: SchemaTypes.String,
        default: null
    },
    userId: {
        type: SchemaTypes.String,
        default: null
    },
    timestamp: {
        type: SchemaTypes.String,
        default: null
    },
    reason: {
        type: SchemaTypes.String,
        default: null
    },
    caseId: {
        type: SchemaTypes.Number,
        default: null
    },
    referenceCaseId: {
        type: SchemaTypes.Number,
        default: null
    },
    type: {
        type: SchemaTypes.String,
        default: null
    }
});

module.exports = model('caseSchema', caseSchema);