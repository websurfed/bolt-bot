const { CommandInteraction } = require('discord.js');
const { OpenAI } = require('openai');
const { env } = require('node:process');

module.exports = {
    data: {
        name: 'ping',
        description: 'ponggg 🏓',
    },

    run: ({ interaction, client, handler }) => {
        interaction.reply(`pong! <:pingpong:1279268807298515116><:party_:1279268806094753833> ${client.ws.ping}ms`);
    },
};