const { CommandInteraction } = require('discord.js');
const { OpenAI } = require('openai');
const { env } = require('node:process');

module.exports = {
    data: {
        name: 'clear-channel',
        description: 'kaboommmm! 💣',
        defaultMemberPermission: 'MANAGE_MESSAGES'
    },
    run: async ({ interaction, client, handler }) => {
        const channel = interaction.channel;

        await interaction.reply({ content: 'yippeee! <:party_:1279268806094753833><:balloon_:1279273927192870912> just cleared this channel! <:label_:1279273926148620348> (or at least it should be.. <:hmm_:1279273924999385170>)', ephemeral: true });

        let fetched;
        do {
            fetched = await channel.messages.fetch({ limit: 100 });
            await channel.bulkDelete(fetched);
        } while (fetched.size >= 2);  // Continue until no more messages are found

    },
    
    options: {
        userPermissions: ['ManageMessages'],
    }
};
