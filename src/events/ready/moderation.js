const { env } = require('node:process');
const { CohereClient } = require('cohere-ai')

const path = require('path');
const { addLog } = require(path.join(__dirname, '../../../add'));

const cohere = new CohereClient({
  token: env.COHERE,
});
const disabled = false;
const moderationChannels = ['1271853103918092330']
const moderationFile = [
    // allowed words
    {
         "text":"hello",
         "label":"Valid"
      },
    {
         "text":"roblox",
         "label":"Valid"
      },
    {
         "text":"fuck",
         "label":"Valid"
      },
    {
         "text":"bitch",
         "label":"Valid"
      },
    {
         "text":"shit",
         "label":"Valid"
      },
    {
         "text":"dick",
         "label":"Valid"
      },
    {
         "text":"cum",
         "label":"Valid"
      },
    {
         "text":"stfu",
         "label":"Valid"
      },
    {
         "text":"ass",
         "label":"Valid"
      },
    {
         "text":"vagina",
         "label":"Valid"
      },
    {
         "text":"sex",
         "label":"Valid"
      },
    {
         "text":"rizz",
         "label":"Valid"
      },
    {
         "text":"how are you",
         "label":"Valid"
      },
    {
         "text":"how are you",
         "label":"Valid"
      },
    {
         "text":"skibidi toilet",
         "label":"Valid"
      },
    // not allowed
    {
        "text":"nigga",
        "label":"Inappropriate"
    },
    {
     "text":"n i g g a",
     "label":"Inappropriate"
    },
    {
     "text":"faggot / fag",
     "label":"Inappropriate"
    },
    {
     "text":"im going to call you a racial slur",
     "label":"Inappropriate"
    },
    {
     "text":"twink",
     "label":"Inappropriate"
    },
    {
     "text":"fag",
     "label":"Inappropriate"
    },
    {
     "text":"ching chong / china man / chinaman",
     "label":"Inappropriate"
    },
    // repeating
    {
     "text":"faggot / fag",
     "label":"Inappropriate"
    },
    {
     "text":"im going to call you a racial slur",
     "label":"Inappropriate"
    },
    {
        "text":"nigga / nga",
        "label":"Inappropriate"
    },
    {
     "text":"twink",
     "label":"Inappropriate"
    },
    {
     "text":"fag",
     "label":"Inappropriate"
    },
    {
     "text":"ching chong / china man / chinaman",
     "label":"Inappropriate"
    },
    {
     "text":"nigger",
     "label":"Inappropriate"
    },
    {
     "text":"nigr",
     "label":"Inappropriate"
    },

    {
     "text":"ni / nig / ngr",
     "label":"Valid"
    },
    {
     "text":"nga",
     "label":"Inappropriate"
    },
    {
     "text":"i hate ngrs",
     "label":"Inappropriate"
    },
    {
     "text":"fuk ngrs",
     "label":"Inappropriate"
    },
    {
     "text":"ngr",
     "label":"Inappropriate"
    },
    {
     "text":"ngrs",
     "label":"Inappropriate"
    },
    {
     "text":"racist",
     "label":"Valid"
    },
    {
     "text":"im a racist",
     "label":"Valid"
    },
    {
     "text":"i support racists",
     "label":"Valid"
    },
    {
     "text":"retard",
     "label":"Inappropriate"
    },
    {
     "text":"retards",
     "label":"Inappropriate"
    },
    {
     "text":"retarded",
     "label":"Inappropriate"
    },
    {
     "text":"slur",
     "label":"Valid"
    },
    {
     "text":"slurs",
     "label":"Valid"
    },
    {
     "text":"slurs are okay",
     "label":"Valid"
    },
    {
     "text":"slut",
     "label":"Inappropriate"
    },
    {
     "text":"sluts ",
     "label":"Inappropriate"
    },
    {
     "text":"IDK MAN",
     "label":"Valid"
    },
    {
     "text":"nigerian",
     "label":"Valid"
    },
    {
     "text":"nigerians ",
     "label":"Valid"
    },
    {
     "text":"#certifiedslut ",
     "label":"Inappropriate"
    },
    {
     "text":" #slut ",
     "label":"Inappropriate"
    },
    {
     "text":" Raising Canes SUCKS",
     "label":"Inappropriate"
    },
    {
     "text":" canes",
     "label":"Valid"
    },
    {
     "text":" canes is good ok ",
     "label":"Valid"
    },
    {
     "text":" raising canes ",
     "label":"Valid"
    },
    {
     "text":" ÑIĞGATRON ",
     "label":"Inappropriate"
    },
    {
     "text":" fæğœț  ",
     "label":"Inappropriate"
    },
    {
     "text":" np  ",
     "label":"Valid"
    },
    ]

module.exports = (client) => {
    client.on('messageCreate', async message => {
        if (message.author.bot) return;
        if (!moderationChannels.includes(message.channelId)) {
            return;
        }

        try {
            const botMember = message.guild.members.me;
            const canModerate = botMember.roles.highest.comparePositionTo(message.member.roles.highest) > 0;
            
            const response = await cohere.classify({
                model: "embed-multilingual-v3.0",
                inputs: [message.content],
                examples: moderationFile,
                labels: ["Inappropriate", "Valid"],
            });
            const classification = response.classifications[0]

            const prediction = classification.prediction
            const confidence = classification.confidence

            if (prediction === "Inappropriate" && confidence > 0.47 && disabled === false) {
                await message.delete();

                message.author.send(`<:storm:1276909835421487104> • **Your message was moderated in Bolt Studios.** \n## <:red_ticket_:1279281706716889109> • If you feel like something is wrong with our moderation, then please create a ticket.`)
                    .then(() => {
                        console.log(`Message successfully sent to ${message.author.tag}.`);
                    })
                    .catch(async error => {
                        if (error.code === 50007) { // Discord error code for "Cannot send messages to this user"
                            console.log(`${message.author.tag} has their DMs closed or has blocked the bot.`);

                            // Send a message to the channel and store the sent message in a variable
                            const botMessage = await message.channel.send(`${message.author} you better open your DMs pookie.. <:winky_:1279513462120386783><:hmm_:1279273924999385170><:sweaty_:1279515299195916389>`);

                            // Add a filter to only allow the first reply from the specific user
                            const filter = reply => 
                                reply.reference && 
                                reply.reference.messageId === botMessage.id && 
                                reply.author.id === message.author.id;

                            // Create a message collector with the filter, limit to 1 reply
                            const collector = message.channel.createMessageCollector({ filter, max: 1, time: 60000 }); // 1 minute

                            // When the first valid reply is collected, respond to it
                            collector.on('collect', reply => {
                                reply.reply('pookie bear please! <a:biting_lip_:1279517898745839797>');
                            });

                            // Optionally handle the end of the collection period
                            collector.on('end', collected => {
                                if (collected.size === 0) {
                                    console.log('No valid replies were collected.');
                                }
                            });
                        } else {
                            console.error(`Failed to send DM to ${message.author.tag}:`, error);
                        }
                    });

                if (canModerate) {
                    addLog(`Inappropriate`, `User: ${message.author.username} | Sent: ${message.content}`)
                    //await message.member.timeout(60 * 1000, `user said '${message.content}'`);
                }
            }

            
            
        } catch (error) {
            console.error('Error during moderation:', error);
        }
    });

}
