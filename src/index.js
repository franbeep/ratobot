require("dotenv").config();
const Discord = require("discord.js");
const models = require("./models");
const handle = require("./middleware");
const { listenWaitlistMessage } = require("./controller/listeners");

const discordClient = new Discord.Client();
const startupDeleteDB = false;

// db init
models.sequelize.sync({ force: startupDeleteDB }).then(() => {
  console.log("Connected to PostgreSQL.");

  // discord init
  discordClient.login(process.env.DISCORD_TOKEN);
  discordClient.once("ready", () => {
    console.log("Connected to Discord Bot.");

    // listening to previous messages
    console.log("Listening to messages.");
    models.Config.findAll().then((configs) => {
      configs.forEach((config) => {
        if (!config.waitlistMessage) {
          return;
        }
        const guild = discordClient.guilds.resolve(config.server);
        guild.channels.cache.forEach((channel) => {
          if (channel.type === "text") {
            channel.messages
              .fetch(config.waitlistBoardMessage)
              .then((message) => {
                listenWaitlistMessage(message, config, models);
              });
          }
        });
      });
    });
  });
});

// relay message
const prefix = process.env.DISCORD_COMMANDPREFIX;
discordClient.on("message", (message) => {
  // ...
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }
  const request = {};
  request.args = message.content.slice(prefix.length).split(" ");
  request.command = request.args.shift().toLowerCase();
  request.message = message;
  request.discordClient = discordClient;
  request.models = models;

  handle(request);
});
