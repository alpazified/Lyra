const caseSchema = require("../database/schemas/caseSchema")

async function getCaseNumber() {
    const count = await caseSchema.collection.countDocuments()
    return count || 0;
};

module.exports = { getCaseNumber }