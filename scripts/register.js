require("dotenv").config();
const fs = require('node:fs')
const { Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");

const commands = [];
const slashCommands = fs.readdirSync(`./commands`);
for (const module of slashCommands) {
    const commandFiles = fs.readdirSync(`./commands/${module}`)
        .filter((file) => file.endsWith(".js"))

    for (const commandFile of commandFiles) {
        const command = require(`../commands/${module}/${commandFile}`);
        commands.push(command);
    }
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
    body: commands
})
    .then(() => console.log("(/) Successfully registered application commands."))
    .catch(console.error);
