require('dotenv').config();
const { Client, GatewayIntentBits, Partials, ActivityType, Collection } = require('discord.js');
const fs = require('fs');
const { init } = require('./database/mongoose');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMembers
    ],
    partials: [
        Partials.GuildMember,
        Partials.User
    ],
    allowedMentions: {
        parse: [],
        repliedUser: false
    },
    ws: { properties: { browser: 'Discord iOS' } },
    presence: {
        activities: [{
            type: ActivityType.Listening,
            name: 'among us bass boosted remix lullabies'
        }],
        status: 'online'
    }
});

// Defines the variables for commands, buttons and modals
client.slashCommands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

// Gets the event files
const eventFiles = fs.readdirSync('./events')
    .filter((file) => file.endsWith('.js'));

// Sets the event files and runs them
for (const file of eventFiles) {
    const event = require('./events/' + file)
    if (event.once) {
        client.once(event.name, (...args) => event.run(...args, client))
    } else {
        client.on(event.name, (...args) => event.run(...args, client))
    };
};

// Gets the slash command folder
const slashCommands = fs.readdirSync('./commands')

// Gets the commands from individual folder
for (const module of slashCommands) {
    const commandFiles = fs.readdirSync('./commands/' + module)
        .filter((file) => file.endsWith('.js'));

    // Attaches the command to the client defined variable
    for (const commandFile of commandFiles) {
        const command = require(`./commands/${module}/${commandFile}`);
        client.slashCommands.set(command.name, command);
    };
};

// Initializes the database
init()

// Connects to the application
client.login(process.env.TOKEN);