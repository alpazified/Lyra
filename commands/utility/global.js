const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { config } = require('../../data/config');
const { banUser } = require('../../function/banUser');
const { getCase } = require('../../function/getCase');
const { getCaseNumber } = require('../../function/getCaseNumber');
const { unbanUser } = require('../../function/unbanUser');

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
                    required: true
                }
            ]
        },
        {
            name: 'unban',
            description: 'Globally unbans a user from participating servers',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'User to unban',
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: 'reason',
                    description: 'Reason for unbanning the user',
                    type: ApplicationCommandOptionType.String,
                    require: true
                },
                {
                    name: 'caseid',
                    description: 'Reference Case ID in which the user was banned',
                    type: ApplicationCommandOptionType.String,
                    require: true
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
        const caseID = interaction.options.getString('caseid');
        const caseNum = await getCaseNumber()

        const invalidCase = new EmbedBuilder()
            .setDescription(config.values.common.error.invalidCase)
            .setColor(Colors.Red);

        const invalidUser = new EmbedBuilder()
            .setDescription(config.values.common.error.invalidUser
                .replace('{user_id}', user?.id))
            .setColor(Colors.Red)

        const successfulBan = new EmbedBuilder()
            .setDescription(config.values.moderation.globallyBanned
                .replace('{user}', user?.tag))
            .setColor(Colors.DarkNavy)

        const userPermError = new EmbedBuilder()
            .setDescription(config.values.common.error.userHierarchyErr)
            .setColor(Colors.Red)

        const unableToModerate = new EmbedBuilder()
            .setDescription(config.values.common.error.userHierarchyErr)
            .setColor(Colors.Red)

        const unableToDM = new EmbedBuilder()
            .setDescription(config.values.common.error.unableToDM)
            .setColor(Colors.Red)

        if (!user) {
            return interaction.reply({ embeds: [invalidUser], ephemeral: true });
        }

        switch (command) {
            case 'ban': {
                try {
                    // Checks if the user is in the guild
                    if (user.joined_at) {

                        // Checks if the user's highest roles are above the command invoker's highest roles
                        if (user.roles?.highest >= interaction.member.roles.highest) {
                            return interaction.reply({ embeds: [userPermError], ephemeral: true })

                            // Checks if the user can be banned by the bot
                        } else if (!user.bannable) {
                            return interaction.reply({ embeds: [unableToModerate], ephemeral: true });
                        };
                    };


                    // Sends the initial command ban embed
                    await interaction.deferReply();
                    await interaction.followUp({ embeds: [successfulBan] });

                    const banDM = new EmbedBuilder()
                        .setDescription(config.values.moderation.DMBanNotice
                            .replace('{server_name}', interaction.guild.name)
                            .replace('{reason}', `**${reason}**`))
                        .setColor(`#2F3136`);

                    // Adds every guild to the array
                    const guildNames = []
                    config.values.guilds.guilds.forEach((x) => {
                        guildNames.push(x.name)
                    });

                    // Pushes the first 5 guild names to the array in the form of a disabled button
                    const guildRow1 = []
                    guildNames.splice(0, 2).forEach((name) => {
                        guildRow1.push(new ButtonBuilder({ disabled: true, label: name, style: ButtonStyle.Secondary, custom_id: name.replace(' ', '_') }))
                    })

                    // Adds the buttons to the array
                    const row1 = new ActionRowBuilder()
                        .addComponents(guildRow1)

                    // Sends the user the ban notice
                    await user.send({ embeds: [banDM], components: [row1] }).catch((err) => { interaction.followUp({ embeds: [unableToDM], ephemeral: true }) });

                    // Gets every server added to the config file
                    config.values.guilds.guilds.forEach(async (x) => {
                        if (x.id && x.ban) {
                            // Fetches each guild in the configuration file
                            const guild = await client.guilds.fetch(x.id).catch((err) => {
                                console.error(err.message)
                                interaction.followUp({ embeds: [{ description: 'Unable to find guild **{guild}**'.replace('{guild}', x.name) }] })
                            });
                            if (guild) {
                                // Bans the user in every guild in the configuration file
                                await guild.bans.create(user, { reason: `Case ID: ${caseNum + 1}` }).catch((err) => {
                                    console.log(err.message);
                                    interaction.followUp({ embeds: [{ description: 'Unable to ban the user in guild ID: ' + x.id, color: Colors.Red }] });
                                });
                            };
                        };
                    });

                    // Handles the function that logs banned users 
                    return await banUser(user, reason, interaction.member, interaction.guild);
                } catch (err) {
                    return interaction.followUp({ embeds: [{ description: 'An unknown error occured, try again later.', color: Colors.Red }], ephemeral: true})
                };
            } case 'unban': {
                const caseCheck = await getCase(caseID);
                if (!caseCheck) {
                    return interaction.followUp({ embeds: [invalidCase], ephemeral: true }); 
                }

                // Gets every server added to the config file
                config.values.guilds.guilds.forEach(async (x) => {
                    if (x.id && x.ban) {
                        // Fetches each guild in the configuration file
                        const guild = await client.guilds.fetch(x.id).catch((err) => {
                            console.error(err.message)
                            interaction.followUp({ embeds: [{ description: 'Unable to find guild **{guild}**'.replace('{guild}', x.name) }] })
                        });
                        if (guild) {
                            // Bans the user in every guild in the configuration file
                            await guild.bans.remove(user, { reason: `Case ID: ${caseNum + 1}` }).catch((err) => {
                                console.log(err.message);
                                interaction.followUp({ embeds: [{ description: 'Unable to unban the user in guild ID: ' + x.id, color: Colors.Red }] });
                            });
                        };

                        return await unbanUser(user, reason, caseID, interaction.member, interaction.guild);
                    };
                });
            };
        };
    },
};