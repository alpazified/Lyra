const { EmbedBuilder } = require('discord.js');
const { checkBannedUser } = require('../function/checkBannedUser');

module.exports = {
    name: 'guildMemberAdd',
    once: false,

    /**
     * @param {import('discord.js').GuildMember} member 
     */
    run: async (member) => {
        const banned = await checkBannedUser(member)
        if (banned.lyraBanned) {
            return await member.ban('Globally banned through Lyra. Run /global view [user] for more info.')
        }
        if (banned.blacklisterBan) {
            const blacklisterNotice = new EmbedBuilder()
                .setDescription('This user is blacklisted on the **blacklister.xyz** API. It is strongly recommended to take action against this user.')
                .addFields(
                    { name: 'User ID • ', value: member.id },
                    { name: 'Joined at • ', value: Math.floor(Date.now() / 1000) }
                )

        }
    }
};