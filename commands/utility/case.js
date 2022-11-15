const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, codeBlock } = require('discord.js');
const { getCase } = require('../../function/getCase');
const { customSubstring } = require('../../util/customSubstring');

module.exports = {
    name: 'case',
    description: 'View a moderation case',
    cooldown: 3000,
    permLevel: 1,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'id',
            description: 'The Case ID',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'ephemeral',
            description: 'Choose to ephemerally send the response',
            type: ApplicationCommandOptionType.Boolean,
            required: false
        }
    ],



    /**
    * @param {import('discord.js').ChatInputCommandInteraction} interaction
    * @param {import('discord.js').Client} client
    */

    run: async (interaction, client) => {
        const caseId = interaction.options.getString('id');
        const ephemeral = interaction.options.getBoolean('ephemeral') || false;
        const cased = await getCase(caseId);
        const user = caseId.userId ? await client.users.fetch(caseId?.userId) : null;
        await interaction.deferReply({ ephemeral });

        if (!cased) {
            return interaction.followUp({ content: 'Unable to find a case for the provided ID', ephemeral: true });
        } else if (cased) {
            const caseEmbed = new EmbedBuilder()
                .setTitle(`Case ID: ${caseId}`)
                .setDescription('Ban Reason: \n' + codeBlock(cased.reason))
                .addFields(
                    { name: 'User ID: ', value: `<@${cased.userId}>`, inline: true },
                    { name: 'Moderator ID: ', value: `<@${cased.moderatorId}>`, inline: true },
                    { name: 'Banned At: ', value: `<t:${Math.floor(cased.bannedAt / 1000)}:f>` },
                    { name: 'Banned in: ', value: cased.guildId }
                )
                .setFooter({ text: `Case Type: ${capitalizeFirstLetter(cased.type)}`, iconURL: user?.avatarURL() })
                .setColor(`#2F3136`);

            if (cased.referenceCaseId) {
                caseEmbed.addFields({ name: 'Reference Case', value: `${cased.referenceCaseId}` })
            }

            return interaction.followUp({ embeds: [caseEmbed] })
        }
    },
};

function capitalizeFirstLetter(string) {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
}