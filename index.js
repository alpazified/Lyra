require('dotenv').config()
const { Client, GatewayIntentBits, Partials, ActivityType, Collection } = require('discord.js');
const fs = require('fs');
// const { init } = require('./database/mongoose');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMembers
    ],
    allowedMentions: {
        repliedUser: false,
        parse: []
    },
    partials: [
        Partials.User,
        Partials.GuildMember
    ],
    presence: {
        activities: [{
            type: ActivityType.Listening,
            name: "among us bass boosted",
        }],
        status: 'online'
    },
    ws: { properties: [{ browser: "Discord iOS" }] }
});

client.slashCommands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

module.exports = { client };

const eventFiles = fs.readdirSync('./events')
    .filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require('./events/' + file)
    if (!event.disabled) {
        if (event.once) {
            client.once(event.name, (...args) => event.run(...args, client));
        } else {
            client.on(event.name, (...args) => event.run(...args, client));
        }
    }
};

const slashCommands = fs.readdirSync('./commands')

for (const module of slashCommands) {
    const commandFiles = fs
        .readdirSync('./commands/' + module)
        .filter((file) => file.endsWith('.js'));

    for (const commandFile of commandFiles) {
        const command = require(`./commands/${module}/${commandFile}`);
        client.slashCommands.set(command.name, command)
    };
};

// const buttonFiles = fs.readdirSync('./buttons');

// for (const buttonFile of buttonFiles) {
//     const button = require('./buttons/' + buttonFile)
//     client.buttons.set(button.name, button)
// };

// init();
client.login(process.env.TOKEN);