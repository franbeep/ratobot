const { BaseAction } = require("./base");

const MINIMUM_LEVEL = 0;

const moverActionExec = function (request) {
  request.models.Config.findAll({
    where: {
      server: request.message.guild.id,
      category: request.message.channel.parentID,
    },
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

    const { groupId, group } = request.modelUser;

    if (!groupId || !(group.leader === request.modelUser.gameName)) {
      // no group or not leader
      request.message.author.send(
        "Você não está em nenhum grupo ou não é lider de um."
      );
      return;
    }

    const channelMembers = request.message.member.voice.channel.members;

    request.models.User.findAll({ where: { groupId } }).then((users) => {
      const partyMembers = [];
      users.forEach((user) => {
        channelMembers.forEach((member) => {
          if (member.user.id === user.discordIdentifier)
            partyMembers.push(member);
        });
      });

      console.log("users.length:", users.length);
      console.log("partyMembers.length:", partyMembers.length);

      if (users.length === partyMembers.length) {
        console.log("HOHO!");
        // all members here
        partyMembers.forEach((member) => {
          member.voice.setChannel(config.mainVoiceChannel);
        });
        request.message.author.send("Grupo movido para canal principal.");
      } else {
        console.log("not today");
        request.message.author.send(
          "Todos os membros precisam estar no canal para serem movidos."
        );
      }
    });
  });
};

module.exports = {
  mover: new BaseAction(MINIMUM_LEVEL, moverActionExec),
};
