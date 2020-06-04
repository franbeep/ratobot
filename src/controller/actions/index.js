// ira tratar todos os comandos

const ajuda = require("./ajuda");
const admin = require("./admin");
const gerar = require("./gerar");
const grupo = require("./grupo");
const mover = require("./mover");
const registrar = require("./registrar");
const canal = require("./canal");

const { BaseAction } = require("./base");

module.exports = {
  // actions
  ...ajuda,
  ...admin,
  ...gerar,
  ...grupo,
  ...mover,
  ...registrar,
  ...canal,
  test: new BaseAction(0, function (request) {}),
  debug: new BaseAction(0, function (request) {
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
  }),
};
