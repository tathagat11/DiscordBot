const { Client, GatewayIntentBits } = require('discord.js');
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

client.on('messageCreate', function(msg){
    if(msg.content === 'ping'){
        msg.reply('pong');
    }
});

const token = process.env['TOKEN']
client.login(token)