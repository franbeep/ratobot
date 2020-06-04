// ira tratar todos os comandos

const ajuda = require("./ajuda");
const admin = require("./admin");
const gerar = require("./gerar");
const grupo = require("./grupo");
const mover = require("./mover");
const registrar = require("./registrar");
const canal = require("./canal");

const { BaseAction } = require("./base");

const { listenWaitlistMessage } = require("../listeners");

module.exports = {
  // actions
  ...ajuda,
  ...admin,
  ...gerar,
  ...grupo,
  ...mover,
  ...registrar,
  ...canal,
  test: new BaseAction(0, function (request) {
    // console.log(request.modelUser.gameName);
    // console.log(request.modelUser.server);

    const printResults = async () => {
      request.message.reply("Hello!");

      console.log("Model user:");
      console.log("--------------------");
      console.log(
        request.modelUser.dataValues
          ? request.modelUser.dataValues
          : request.modelUser
      );

      console.log("Config:");
      console.log("--------------------");
      await request.models.Config.findAll({
        where: {
          server: request.message.guild.id,
          category: request.message.channel.parentID,
        },
      }).then((configs) => {
        const [config] = configs;
        if (config) {
          console.log(config.dataValues);
        }
      });

      console.log("Group");
      console.log("--------------------");
      await request.models.Group.findAll({
        where: {
          server: request.message.guild.id,
          category: request.message.channel.parentID,
        },
      }).then((groups) => {
        groups.forEach((group) => {
          console.log(group.dataValues);
        });
      });

      console.log("Queue");
      console.log("--------------------");
      await request.models.Queue.findAll({
        where: {
          server: request.message.guild.id,
          category: request.message.channel.parentID,
        },
      }).then((queues) => {
        queues.forEach((queue) => {
          console.log(queue.dataValues);
        });
      });
    };

    printResults();

    // request.message.react("⏫");

    // console.log(request.modelUser);

    // request.models.User.findAll().then((users) => {
    //   console.log(users);
    // });

    // request.models.Config.findAll().then((configs) => {
    //   console.log(configs);
    // });

    // console.log(request.message.guild.channels);
    // request.message.member.setNickname("LOLOLOOL");

    // const { models } = request;
    // const { client } = request.message;

    // models.Config.findAll().then((configs) => {
    //   configs.forEach((config) => {
    //     const guild = client.guilds.resolve(config.server);
    //     guild.channels.cache.forEach((channel) => {
    //       if (channel.type === "text") {
    //         channel.messages
    //           .fetch(config.waitlistBoardMessage)
    //           .then((message) => {
    //             console.log(message);
    //             listenWaitlistMessage(message, config);
    //           });
    //       }
    //     });
    //   });
    // });
  }),
};
