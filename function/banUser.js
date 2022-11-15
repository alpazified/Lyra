const bannedUsersSchema = require('../database/schemas/bannedUsersSchema');
const caseSchema = require('../database/schemas/caseSchema');
const { getCaseNumber } = require('./getCaseNumber');

/**
 * Adds the banned user to the database 
 * @param {import('discord.js').User} user 
 * @param {String} reason
 * @param {import('discord.js').GuildMember} moderator 
 * @param {import('discord.js').Guild} guild 
 */
async function banUser(user, reason, moderator, guild) {
    if (!user.id || !guild?.id) {
        return;
    }
    const num = await getCaseNumber();
    await caseSchema.create({
        guildId: guild.id,
        moderatorId: moderator.id,
        userId: user.id,
        reason: reason,
        timestamp: Date.now(),
        caseId: num + 1,
        type: 'ban'
    });

    await bannedUsersSchema.updateOne(
        { clientId: guild.client.user.id },
        { $push: { users: user?.id } },
        { upsert: true },
    );
};

module.exports = { banUser };