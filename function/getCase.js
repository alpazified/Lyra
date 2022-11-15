const caseSchema = require("../database/schemas/caseSchema");

/**
 * 
 * @param {String} caseid 
 */
async function getCase(caseid) {
    const foundCase = await caseSchema.findOne({ caseId: caseid }).clone();
    return foundCase;
};

module.exports = { getCase };