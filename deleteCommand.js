const { REST, Routes } = require('discord.js');
const { env } = require('node:process');

const rest = new REST({ version: '10' }).setToken(env.BOT_TOKEN);

// Command ID and Guild ID (if applicable)
const commandId = '1275547527818510389';
const guildId = 'YOUR_GUILD_ID'; // If deleting a guild-specific command

(async () => {
    try { 
        const commands = await rest.get(Routes.applicationCommands(env.CLIENT_ID, '1268727073648672780'));

        const command = commands.find(cmd => cmd.id === commandId);
        
        if (!command) {
            console.error(`Command with ID ${commandId} not found.`);
            return;
        }

        await rest.delete(Routes.applicationCommand(env.CLIENT_ID, commandId)); // Or Routes.applicationGuildCommand(env.CLIENT_ID, guildId, commandId) for guild-specific
        console.log(`Deleted command with ID: ${commandId}`);
    } catch (error) {
        console.error('Error deleting command:', error);
    }
})();
