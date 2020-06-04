const { BaseAction, notYetImplemented } = require("./base");

const MINIMUM_LEVEL = 0;

const grupoActionExec = function (request) {
  request.message.author.send(
    "Uso: !grupo <membros|convidar|criar|sala|sair|retirar|mapa>."
  );
};

const grupoMembrosActionExec = function (request) {
  const { group } = request.modelUser;

  if (!group) {
    // no group
    request.message.author.send("Você não está em nenhum grupo.");
    return;
  }

  request.models.User.findAll({
    where: {
      group,
      server: request.message.guild.id,
      category: request.message.channel.parentID,
    },
  }).then((users) => {
    const [user] = users;

    if (!user) {
      return;
    }

    request.message.author.send(
      "Membros do grupo:",
      users.reduce((acc, val) => `${val}, ${acc}`, "")
    );
  });
};

const grupoConvidarActionExec = function (request) {
  if (request.args < 1) {
    // no name
    request.message.author.send(
      "Uso: !grupo convidar <nome_ingame_do_jogador>"
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

  const [gameName] = request.args;

  request.models.User.findAll({
    where: {
      gameName,
      server: request.message.guild.id,
      category: request.message.channel.parentID,
    },
  }).then((users) => {
    const [user] = users;

    if (!user) {
      return;
    }

    request.models.User.update({ group }, { where: { id: user.id } });

    request.message.guild.members
      .fetch(user.discordIdentifier)
      .send(`Você entrou em um grupo! Mapa: '${group.map}'`);
  });
};

const grupoCriarActionExec = function (request) {
  if (request.modelUser.groupId) {
    // already got a group
    request.message.author.send("Você já tem um grupo.");
    return;
  }

  request.models.Group.create({
    leader: request.modelUser.gameName,
    server: request.message.guild.id,
    category: request.message.channel.parentID,
  }).then((group) => {
    request.models.User.update(
      { groupId: group.id },
      { where: { id: request.modelUser.id } }
    ).then(() => {
      request.message.author.send(
        "Você acabou de criar um grupo. Você é o lider do grupo."
      );
    });
  });
  // create group
};

const grupoSalaActionExec = function (request) {
  // create group room

  const { group, groupId } = request.modelUser;

  if (!groupId || !(group.leader === request.modelUser.gameName)) {
    // no group or not leader
    request.message.author.send(
      "Você não está em nenhum grupo ou não é lider de um."
    );
    return;
  }

  const channelName = `Sala #${new Date().getTime()}`;

  request.message.guild.channels
    .create(`[RB] ${channelName}`, {
      type: "voice",
      parent: request.message.channel.parentID,
    })
    .then((channel) => {
      channel.setParent(request.message.channel.parentID);
    });
};

const grupoSairActionExec = function (request) {
  const { groupId } = request.modelUser;

  if (!groupId) {
    // no group
    request.message.author.send("Você não está em nenhum grupo.");
    return;
  }

  request.models.User.update(
    { groupId: null },
    { where: { id: request.modelUser.id } }
  ).then(() => {
    request.models.User.findAll({
      where: {
        groupId,
        server: request.message.guild.id,
        category: request.message.channel.parentID,
      },
    }).then((users) => {
      if (users.length <= 0) {
        request.models.Group.destroy({ where: { id: groupId } });
      }
    });
  });
};

const grupoRetirarActionExec = function (request) {
  const { group, groupId } = request.modelUser;

  if (request.args.length < 1) {
    // no name
    request.message.author.send("Uso: !grupo retirar <nome_ingame_do_jogador>");
    return;
  }

  if (!groupId || !(group.leader === request.modelUser.gameName)) {
    // no group or not leader
    request.message.author.send(
      "Você não está em nenhum grupo ou não é lider de um."
    );
    return;
  }

  const [name] = request.args;

  request.models.User.findAll({
    where: {
      gameName: name,
      server: request.message.guild.id,
      category: request.message.channel.parentID,
    },
  }).then((users) => {
    const [user] = users;

    if (!user) {
      return;
    }

    if (user.groupId === request.modelUser.groupId) {
      request.models.User.update(
        { groupId: null },
        {
          where: {
            gameName: name,
            server: request.message.guild.id,
            category: request.message.channel.parentID,
          },
        }
      );
    }
  });
};

const grupoMapaActionExec = (request) => {
  if (request.args < 1) {
    // no name
    request.message.author.send("Uso: !grupo mapa <nome_do_mapa>");
    return;
  }

  const { group } = request.modelUser;

  if (!group || !(group.leader === request.modelUser.gameName)) {
    // no group or not leader
    request.message.author.send(
      "Você não está em nenhum grupo ou não é lider de um."
    );
    return;
  }

  const [map] = request.args;

  request.models.Group.update(
    { map },
    { where: { id: request.modelUser.groupId } }
  ).then(() => {
    request.message.author.send("Atribuído mapa com sucesso.");
  });
};

const actions = {
  membros: new BaseAction(MINIMUM_LEVEL, grupoMembrosActionExec),
  convidar: new BaseAction(MINIMUM_LEVEL, grupoConvidarActionExec),
  criar: new BaseAction(MINIMUM_LEVEL, grupoCriarActionExec),
  sala: new BaseAction(MINIMUM_LEVEL, grupoSalaActionExec),
  sair: new BaseAction(MINIMUM_LEVEL, grupoSairActionExec),
  retirar: new BaseAction(MINIMUM_LEVEL, grupoRetirarActionExec),
  mapa: new BaseAction(MINIMUM_LEVEL, grupoMapaActionExec),
};

module.exports = {
  grupo: new BaseAction(MINIMUM_LEVEL, grupoActionExec, actions),
};
