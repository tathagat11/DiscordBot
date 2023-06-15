const { Client, GatewayIntentBits } = require('discord.js')
const { Configuration, OpenAIApi } = require('openai')
const dotenv = require('dotenv')
const fetch = require("@replit/node-fetch")
const Database = require("@replit/database")
const keepAlive = require("./server")

const db = new Database()


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
})

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}.`)
})


//hi command
client.on('messageCreate', function(message) {
  if (message.author.bot) return
  if (message.content === 'hi') {
    message.reply('hello there')
  }
})
//noob command
client.on('messageCreate', function(message) {
  if ((message.author.bot) || message.content.startsWith('$')) return
  if (message.content.includes("noob")) {
    message.reply(`no you're noob`)
  }
})

//ai bot
// dotenv.config()
// const openaikey = process.env['openai']
// const openai = new OpenAIApi(new Configuration({
//   apiKey: openaikey,
// })
// )
// client.on("messageCreate", async function(message) {
//   if (message.author.bot) return
//   if((message.channelId == 1118587313325359215) || (message.channelId == 1118623267507421246)){
//   try {
//     const response = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: "You are a helpful assistant who responds succinctly" },
//         { role: "user", content: message.content }
//       ],
//     })

//     const content = response.data.choices[0].message
//     return message.reply(content)

//   } catch (err) {
//     //console.log(err)
//     return message.reply(
//       "Error."
//     )
//   }}
// })

//encouragement
const sadWords = ["sad", "depressed", "unhappy", "angry", "anxious", "overwhelmed"]
const starterEncouragements = ["Just don't be ", "Just don't be ", "NOOB! don't be "]

db.get("encouragements").then(encouragements => {
  if (!encouragements || encouragements.length < 1) {
    db.set("encouragements", starterEncouragements)
  }
})

//to add encourage message
function udtEncouragements(eMessage) {
  db.get("encouragements").then(encouragements => {
    encouragements.push(eMessage)
    db.set("encouragements", encouragements)
  })
}

//to delete encourage message
function delEncouragements(index) {
  db.get("encouragements").then(encouragements => {
    if (encouragements.length > index) {
      encouragements.splice(index, 1)
      console.log(encouragements)
      db.set("encouragements", encouragements)
    }
  })
}

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json()
    })
    .then(data => {
      return data[0]["q"] + " - " + data[0]["a"]
    })
}

client.on('messageCreate', function(message) {
  if (message.author.bot) return
  if (message.content === '$inspire') {
    getQuote().then(quote => message.reply(quote))
  }
  var word = ''
  if (sadWords.some(word => message.content.includes(word))) {
    db.get("encouragements").then(encouragements => {
      for (i in sadWords) {
        if (message.content.includes(sadWords[i]))
          word = sadWords[i]
      }
      const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)] + word;
      message.reply(encouragement)
    })
  }
  if (message.content.startsWith('$new')) {
    encouragement = message.content.split("$new ")[1] + ' '
    udtEncouragements(encouragement)
    message.reply("New message added.")
  }
  if (message.content.startsWith('$del')) {
    encouragement = parseInt(message.content.split("$del ")[1])
    delEncouragements(encouragement)
    message.reply("That message is deleted.")
  }
});

keepAlive()
const token = process.env['TOKEN']
client.login(token)



