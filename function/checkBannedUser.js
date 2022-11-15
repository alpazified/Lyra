require('dotenv').config();
const axios = require('axios').default;
const caseSchema = require('../database/schemas/caseSchema');

/**
 * Checks if a user is blacklisted on blacklister.xyz and in the bot
 * @param {import('discord.js').User} user 
 */
async function checkBannedUser(user) {
    const response = {
        lyraBanned: false,
        blacklisterBan: false
    }

    const check = await caseSchema.findOne({ bannedUserId: user.id });
    if (check) {
        response.lyraBanned = true;
    }
    const blacklisterCheck = await axios.get(`https://api.blacklister.xyz/${user?.id}`, {
        headers: { "Authorization": process.env.BLACKLISTER_APIKEY }
    }).catch((err) => { })

    console.log(blacklisterCheck.data)

    if (blacklisterCheck?.data?.blacklisted) {
        response.blacklisterBan = true;
    }

    return response;
};

module.exports = { checkBannedUser };