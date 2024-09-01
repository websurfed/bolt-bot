const { env } = require('node:process');
const { sleep } = require('openai/core');
const path = require('path');
const { addLog } = require(path.join(__dirname, '../../../add'));
const OpenAI = require('openai').OpenAI;

const openai = new OpenAI({
    apiKey: env.QUARDO_KEY,
    baseURL: 'https://api.cow.rip/api/v1'
});
const validChannel = '1274301965261602848';

const chatPrompt = "You are a Discord assistant called Bolt🌩️. You talk in all lowercase and use several emojis in your responses. Your job is to reply with a message informing the user they cant send normal messages in this channel, but they can in the general channel. An example is: `oops! 🫢 it looks like you've sent a message without any media! 🖼️`. The message you recieve will be the message a user sent in the channel that was determined to be not valid, as it didn't contain media, and was simply a general message. And dont copy the example, just know that thats the format you should use! The message format is like this: '{user's username} <> {user's display name} | {the invalid message content}'. You can use the display name and username to personalize the response! Do note that if the message seems directed at YOU (you as in the bot, Bolt), then you can tell them to go to the gpt-4o playground instead of the general channel.";

module.exports = (client) => {
  console.log(`🤖🌩️  ${client.user.username} Application; running on ${client.guilds.cache.size} ${client.guilds.cache.size === 1 ? 'guild' : 'guilds'}`);
  console.log(`🥳🎉 Application; ${client.user.username} running on all Replit servers`)

  client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.channel.id === validChannel) {
      if (message.attachments.size === 0) {
        const botPermissions = message.channel.permissionsFor(message.guild.members.me);
        
        const botMember = message.guild.members.me;
        const canModerate = botMember.roles.highest.comparePositionTo(message.member.roles.highest) > 0;

        if (!botPermissions.has('SEND_MESSAGES')) {
          console.error('Bot lacks permission to send messages.');
          return;
        }

        if (!botPermissions.has('MANAGE_MESSAGES')) {
          console.error('Bot lacks permission to delete messages.');
          return;
        }

        if (!botPermissions.has('MODERATE_MEMBERS')) {
          console.error('Bot lacks permission to timeout members.');
          return;
        }

        await message.channel.sendTyping();

        const history = [ // add system prompt
          {
            role: "system",
            content: chatPrompt
          }
        ];

        history.push({ // add user message
          role: "user",
          content: `${message.author.username} <> ${message.author.displayName} | ${message.content}`
        });

        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: history,
          temperature: 0.8,
          max_tokens: 100,
          top_p: 1,
          frequency_penalty: 2,
          presence_penalty: 1.3,
        });

        const botResponse = await message.reply(response.choices[0].message.content);
        

        await message.delete();

        try {
          if (canModerate) {
            addLog(`Invalid Media`, `User: ${message.author.username} | Sent: ${message.content}`)
            await message.member.timeout(60 * 1000, response.choices[0].message.content);
          }
        } catch (error) {
          console.error('Failed to timeout the user:', error);
        }
        
        sleep(5500).then(() => { botResponse.delete(); }); // wait before deleting the message. to prevent lots of bot messages
      }
    }
  });
};
