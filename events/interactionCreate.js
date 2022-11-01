const { EmbedBuilder, Colors } = require('discord.js');
const { config } = require('../data/config');

module.exports = {
    name: 'interactionCreate',
    once: false,

    /**
     * 
     * @param {import('discord.js').BaseInteraction} interaction 
     * @param {import('discord.js').Client} client 
     */
    run: async (interaction, client) => {
        if (!interaction.inGuild() || !interaction.inCachedGuild()) {
            return;
        }

        // Checks if a user is in allowed IDs list
        if (!config.values.guilds.allowedIds.includes(interaction.user.id)) {
            const noPerms = new EmbedBuilder()
                .setDescription(config.values.common.error.noPerms
                    .replace('{function}', 'function'))
                .setColor(Colors.Red);

            return interaction.reply({ embeds: [noPerms], ephemeral: true });
        };

        // Checks for the command
        const command = client.slashCommands.get(interaction.commandName);

        // Responds with an error if there's no command
        if (!command) {
            const noCommand = new EmbedBuilder()
                .setDescription(config.values.common.error.invalidCommand)
                .setColor(Colors.Red)
            return interaction.reply({ embeds: [noCommand] })
        } else if (command) {

            // Checks if the user's ID is in the list of allowed users 
            if (config.values.guilds.allowedIds.includes(interaction.user.id)) {
                const noPerms = new EmbedBuilder()
                    .setDescription(config.values.common.error.noPerms)
                    .setColor(Colors.Red)
                return interaction.reply({ embeds: [noPerms], ephemeral: true });
            }
            // Runs the command w/ required args
            command.run(interaction, client);
        }
    }
}