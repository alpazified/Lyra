const { ApplicationCommandType, time, EmbedBuilder, ApplicationCommandOptionType, ChannelType } = require('discord.js');


module.exports = {
    name: 'global',
    description: 'Global ban commands',
    cooldown: 3000,
    permLevel: 1,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'ban',
            description: 'Globally bans a user from participating servers',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'User to ban',
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: 'reason',
                    description: 'Reason for banning the user',
                    type: ApplicationCommandOptionType.String,
                    max_length: 400,
                    required: true
                }
            ]
        }
    ],


    /**
    * @param {import('discord.js').ChatInputCommandInteraction} interaction
    * @param {import('discord.js').Client} client
    */

    run: async (interaction, client) => {
        const command = interaction.options.getSubcommand();
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
    },
}