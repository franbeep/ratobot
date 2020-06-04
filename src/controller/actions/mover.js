const { BaseAction } = require("./base");

const MINIMUM_LEVEL = 0;

const moverActionExec = function (request) {
  request.models.Config.findAll({
    where: { server: request.message.guild.id },
  }).then((configs) => {
    const [config] = configs;

    if (!config) {
      request.message.reply(
        "Servidor não configurado. Contacte um Administrator."
      );
      return;
    }

    if (!config.mainVoiceChannel) {
      request.message.reply(
        "Canal principal não configurado. Contacte um Administrator."
      );
      return;
    }

    request.message.author.voice.channel.members.forEach((member) => {
      member.voice.setChannel(config.mainVoiceChannel);
      request.message.reply("Ok");
    });
  });
};

module.exports = {
  mover: new BaseAction(MINIMUM_LEVEL, moverActionExec),
};
