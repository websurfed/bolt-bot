const { CommandInteraction } = require('discord.js');
const { OpenAI } = require('openai');
const { env } = require('node:process');

const allowedChannels = ['1278122171750813697'];  // Replace with your actual channel IDs

const openai = new OpenAI({
    apiKey: env.QUARDO_KEY,
    baseURL: 'https://api.cow.rip/api/v1'
});

function generateKey() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Function to generate a random string of a specific length
    function getRandomString(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Generate the key with the desired format
    const key = `bt-${getRandomString(5)}-${getRandomString(28)}`;

    return key;
}

module.exports = {
    data: {
        name: 'generate-key',
        description: 'need a key? 🔑',
    },
    run: async ({ interaction, client, handler }) => {
        // Check if the command was issued in an allowed channel
        if (!allowedChannels.includes(interaction.channelId)) {
            return interaction.reply({
                content: 'This command cannot be used in this channel.',
                ephemeral: true,  // Makes the response visible only to the user
            });
        }

        // Generate a unique key
        const key = generateKey()

        // Send a reply in the channel
        await interaction.reply({
            content: `
            <a:rocket_:1276941230579908699> • Your key has been sent! \n<:newspaper_:1278154044044738622> • Check your DMs for the key.
            `,
            ephemeral: true,  // The reply is only visible to the user
        });

        // Send the key to the user's DM
        try {
            await interaction.user.send(`
            <a:lightning_:1276941528182296638> • **Your Bolt AI key is:** \n## <:key_:1278157244843819089> • ${key}
            `);
        } catch (error) {
            // Handle cases where the bot can't send a DM
            await interaction.followUp({
                content: `<:stop_:1278129747947159552> • There was an issue creating your DM, make sure your DMs are open.`,
                ephemeral: true,
            });
        }
    },
};
