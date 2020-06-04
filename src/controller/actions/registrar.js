const { BaseAction } = require("./base");

const MINIMUM_LEVEL = 0;
const REGISTRED_LEVEL = 1;

const registrarActionExec = function (request) {
  if (request.args.length < 2) {
    return;
  }

  const [discordTag, gameName] = request.args;

  // if (request.models.User.findAll({ where: { gameName } }).length > 0) {
  //   // already registred
  //   return;
  // }

  request.message.guild.members.cache.forEach((member) => {
    if (member.user.tag === discordTag) {
      request.models.User.create({
        gameName,
        discordIdentifier: member.user.id,
        isBanned: false,
        serverLevel: REGISTRED_LEVEL,
        warningLevel: 0,
        server: request.message.guild.id,
        category: request.message.channel.parentID,
        referral: request.modelUser.gameName,
      });

      member.setNickname(`[RB] ${gameName}`).catch((err) => {
        console.log("Error: setNickname failed:", err);
      });

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

        request.message.guild.roles.fetch(config.registredRole).then((role) => {
          member.roles.add(role).catch((err) => {
            console.log("Error: add role failed:", err);
          });
          request.message.reply("Ok");
        });
      });
    }
  });
};

module.exports = {
  registrar: new BaseAction(MINIMUM_LEVEL, registrarActionExec),
};
