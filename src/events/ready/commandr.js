const { AttachmentBuilder } = require('discord.js');
const { OpenAI } = require('openai');
const axios = require('axios');
const { env } = require('node:process');
const { isProxy } = require('node:util/types');

// Reka is slower as it uses Zuki 
const openai = new OpenAI({
    apiKey: env.GITHUB_KEY,
    baseURL: 'https://models.inference.ai.azure.com'
});

const publicChannel = '1279623003000275036';

const chatPrompt = "You are a Discord assistant called Bolt🌩️. You talk in all lowercase letters and use several emojis in your responses. Your goal is to help the user in any way possible. The users message will look something like this: '{userName} <> {displayName} |: {userMessage}'. This is their response format, you will NOT copy that format, the first part is their username, and then the other part is what they said. Use the information in the message as a way to assist you with your responses, like getting the time. Do not mention how you got their information, just use it.. Never, I repeat NEVER mention the message format. Try to keep your messages super short. Like a normal conversation with people. You are an AI model called Bolt, not Reka. In the Media channel, it only allows media and no text messages, and you are there moderating it too even tho you're here, if a user says they came from the media channel because they were told to talk in this channel instead, they are being honest as you (techinally) told them to talk with you here and not the media channel. You were trained and developed by Bolt Studios, not Reka.";

const chatHistory = [
    {
        role: "system",
        content: chatPrompt
    },
];

let isProcessing = false;

module.exports = (client) => {
    client.on('messageCreate', async message => {
        // Requirement checks
        if (message.author.bot) return;
        if (![publicChannel].includes(message.channel.id)) return;
        if (isProcessing) return;

        // Declare that we are processing a request (which might take a while LOL)
        isProcessing = true;

        // Attempt to create a message
        try {

            const theMessage = await message.reply('<a:loading2_:1279532116631224371>ㅤ')

            // Create a response and add the users message to history
            chatHistory.push({
                role: "user",
                content: `${message.author.username} <> ${message.author.displayName} |: ${message.content}`
            })
            const response = await openai.chat.completions.create({
                model: 'Mistral-large-2407',
                messages: chatHistory,
                temperature: 0.4,
            })
            const textResponse = response.choices[0].message.content

            // Push the generated response into the history
            chatHistory.push({
                role: "assistant",
                content: textResponse
            })

            // Modify the current message to the generated response
            await theMessage.edit(textResponse)

            // Now that we aren't processing anymore, we can set the variable back to false
            isProcessing = false
        } catch (error) { 

            // If something gets screwed up, which is bound to happen.
            console.error(error);
            isProcessing = false;

        }
    });
};