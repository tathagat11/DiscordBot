const { Client, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require ('openai');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}.`)
})

//ping command
client.on('messageCreate', function(message) {
  if (message.author.bot) return;
  if (message.content === 'ping') {
    message.reply('pong');
  }
});
//gay command
client.on('messageCreate', function(message) {
  if (message.author.bot) return;
  if (message.content.includes("gay")) {
    message.reply(`no you're gay`);
  }
});

//ai bot
const openaikey = process.env['openai'];
const openai = new OpenAIApi(new Configuration({
    apiKey: openaikey,
  })
);
client.on("messageCreate", async function (message) {
  if (message.author.bot) return;
  
  try {
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: "You are a helpful assistant who responds succinctly"},
            {role: "user", content: message.content}
        ],
      });

    const content = response.data.choices[0].message;
    return message.reply(content);

  } catch (err) {
    return message.reply(
      "As an AI robot, I errored out."
    );
  }
});

const token = process.env['TOKEN']
client.login(token)