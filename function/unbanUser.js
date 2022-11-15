const bannedUsersSchema = require('../database/schemas/bannedUsersSchema');
const caseSchema = require('../database/schemas/caseSchema');

/**
 * Removes a banned user from the database
 * @param {import('discord.js').User} user 
 * @param {String} reason 
 * @param {Number | String} caseID 
 * @param {import('discord.js').GuildMember} moderator 
 * @param {import('discord.js').Guild} guild
 */
async function unbanUser(user, reason, caseID, moderator, guild,) {
    if (!user?.id || !guild?.id) {
        return;
    };
    await caseSchema.create({
        guildId: guild?.id,
        moderatorId: moderator?.id,
        userId: user?.id,
        reason: reason,
        timestamp: Date.now(),
        caseId: num + 1,
        referenceCaseId: caseID,
        type: 'unban'
    });

    await bannedUsersSchema.updateOne(
        { clientId: guild.client.user.id },
        { $pull: { users: user?.id } }
    );
};

module.exports = { unbanUser };