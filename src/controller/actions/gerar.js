const { BaseAction, notYetImplemented, genWaitlistEmbed } = require("./base");

const { listenWaitlistMessage } = require("../listeners");

const MINIMUM_LEVEL = 0;

const gerarActionExec = function (request) {
  request.message.author.send("Uso: !gerar <principal|regras|espera>.");
};

const gerarRegrasActionExec = notYetImplemented;

const gerarEsperaActionExec = function (request) {
  request.models.Queue.findAll({
    where: {
      server: request.message.guild.id,
      category: request.message.channel.parentID,
    },
    include: [{ model: request.models.User }],
    order: [["createdAt", "ASC"]],
  }).then((queue) => {
    const waitlistMessage = genWaitlistEmbed(queue);

    request.message.channel.send({ embed: waitlistMessage }).then((message) => {
      request.models.Config.update(
        { waitlistBoardMessage: message.id },
        {
          where: {
            server: request.message.guild.id,
            category: request.message.channel.parentID,
          },
        }
      ).then((config) => {
        listenWaitlistMessage(message, config, request.models);
      });

      message.react("⏫").then(() => message.react("⏬"));

      request.message.reply("Ok");
    });
  });
};

// rulesBoardMessage
// waitlistBoardMessage

const gerarPrincipalActionExec = function (request) {
  request.models.Config.findAll({
    where: {
      server: request.message.guild.id,
      category: request.message.channel.parentID,
    },
  }).then((configs) => {
    const [config] = configs;

    if (!config) {
      return;
    }

    // if (config.mainVoiceChannel) {
    //   // already created
    //   return;
    // }

    if (request.args < 1) {
      // no name
      return;
    }

    const [...channelName] = request.args;

    request.message.guild.channels
      .create(`[RB] ${channelName.join(" ")}`, {
        type: "voice",
        parent: request.message.channel.parentID,
        permissionOverwrites: [
          {
            id: config.registredRole,
            deny: ["CONNECT"],
          },
        ],
      })
      .then((channel) => {
        request.models.Config.update(
          { mainVoiceChannel: channel.id },
          {
            where: {
              server: request.message.guild.id,
              category: request.message.channel.parentID,
            },
          }
        );
        request.message.reply("Ok");
      });
  });
};

const actions = {
  regras: new BaseAction(MINIMUM_LEVEL, gerarRegrasActionExec),
  espera: new BaseAction(MINIMUM_LEVEL, gerarEsperaActionExec),
  principal: new BaseAction(MINIMUM_LEVEL, gerarPrincipalActionExec),
};

module.exports = {
  gerar: new BaseAction(MINIMUM_LEVEL, gerarActionExec, actions),
};
