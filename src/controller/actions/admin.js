/* eslint-disable func-names */
const { BaseAction, notYetImplemented, baseEmbed } = require("./base");

const MINIMUM_LEVEL = 5;

const adminActionExec = function (request) {
  request.message.author.send(
    "Uso: !admin <grupos|kick|banir|avisar...>, para uma lista completa, use !admin ajuda."
  );
};

const adminAjudaActionExec = function (request) {
  const ajudaMessage = {
    ...baseEmbed,
    title: "# Ajuda - Comandos Administrativos",
    description:
      "**Segue lista de comandos administrativos disponíveis no bot:**",
    fields: [
      {
        name: "\u200b",
        value: `
        **!admin ajuda** — lista de comandos para administradores
        **!admin grupos** — listar grupos ativos
        **!admin grupo-eliminar <nome_do_mapa>** — exclui grupo
        **!admin kick <usuário>** — kick um usuário do voicechat
        **!admin banir <usuário>** — bane um usuário do servidor
        **!admin avisar <usuário>** — avisa um usuário sobre algo incorreto
        **!admin avisos <usuário>** — gerar quantidade de avisso do usuário
        **!admin banimentos** — listar banimentos
        **!admin mutar <todos|lideres|admins>** — mutar todos, ou deixar somente lideres, ou ou deixar somente admins
        **!admin desmutar** — desmutar todos
        **!admin startup <role_padrão> [quantidade_de_jogadores_no_grupo]** — inicia servidor
        **!admin level <usuário> <level>** — atribui level a um usuário
        **!registrar <nome_no_discord> <nome_no_jogo>** — registra usuário
        **!gerar principal <nome_da_sala>** — gera canal de voice para ser a sala principal
        **!gerar espera** — gera lista de espera
        `,
      },
    ],
  };

  request.message.author.send({ embed: ajudaMessage });
};

const adminGruposActionExec = function (request) {
  request.models.Group.findAll({
    where: {
      server: request.message.guild.id,
      category: request.message.channel.parentID,
    },
  }).then((groups) => {
    const groupsString = groups.reduce((acc, val) => `${val.map}, ${acc}`, "");
    request.message.author.send(`Grupos: ${groupsString}`);
  });
};

const adminGrupoEliminarAtionExec = function (request) {
  if (request.args.length < 1) {
    // no name
    return;
  }

  const [...map] = request.args.join(" ");

  request.models.Group.findAll({
    where: {
      map,
      server: request.message.guild.id,
      category: request.message.channel.parentID,
    },
  }).then((groups) => {
    groups.forEach((group) => {
      request.models.User.update(
        { groupId: null },
        { where: { groupId: group.id } }
      );
    });
    request.models.Group.destroy({ where: { map } }).then(() => {
      request.message.reply("Ok");
    });
  });
};

const adminEstatisticasActionExec = notYetImplemented;

const adminKickActionExec = function (request) {
  if (request.args.length < 1) {
    // no name
    return;
  }

  const [name] = request.args;

  request.models.User.findOne({
    where: {
      gameName: name,
      server: request.message.guild.id,
      category: request.message.channel.parentID,
    },
  }).then((user) => {
    if (user) {
      request.message.guild.members
        .fetch(user.discordIdentifier)
        .then((guildmember) => {
          guildmember.voice.setChannel(null, "Você foi kickado do chat.");
          request.message.reply("Ok");
        });
    } else {
      request.message.author.send(
        `Você não conseguiu kickar ${name} com sucesso. Talvez não esteja no chat.`
      );
    }
  });
};

const adminBanirActionExec = function (request) {
  if (request.args.length < 1) {
    // no name
    return;
  }

  const [name] = request.args;
  const reason =
    request.args.length > 0
      ? `Você  foi banido por: ${request.args[1]}`
      : "Você foi banido.";

  request.models.User.findOne({
    where: {
      gameName: name,
      server: request.message.guild.id,
      category: request.message.channel.parentID,
    },
  }).then((user) => {
    if (user) {
      request.message.guild.members
        .fetch(user.discordIdentifier)
        .then((guildmember) => {
          guildmember.ban({ reason });
        });

      request.models.User.update(
        { isBanned: true },
        { where: { id: user.id } }
      );
      request.message.reply("Ok");
    } else {
      request.message.author.send(
        `Você não conseguiu banir ${name} com sucesso. Talvez não esteja registrado.`
      );
    }
  });
};

const adminAvisarActionExec = function (request) {
  if (request.args.length < 1) {
    // no name
    return;
  }

  const [name] = request.args;

  request.models.User.findOne({
    where: {
      gameName: name,
      server: request.message.guild.id,
      category: request.message.channel.parentID,
    },
  }).then((user) => {
    if (user) {
      request.models.User.update(
        { warningLevel: user.warningLevel + 1 },
        { where: { id: user.id } }
      );
      request.message.reply("Ok");
    } else {
      request.message.author.send(
        `Você não conseguiu avisar ${name} com sucesso. Talvez não esteja registrado.`
      );
    }
  });
};

const adminAvisosActionExec = function (request) {
  if (request.args.length < 1) {
    // no name
    return;
  }

  const [name] = request.args;

  request.models.User.findOne({
    where: {
      gameName: name,
      server: request.message.guild.id,
      category: request.message.channel.parentID,
    },
  }).then((user) => {
    if (user) {
      request.message.author.send(
        `Usuário ${name} tem ${user.warningLevel} avisos.`
      );
    } else {
      request.message.author.send(
        `Você não conseguiu ver os avisos de ${name} com sucesso. Talvez não esteja registrado.`
      );
    }
  });
};

const adminBanimentosActionExec = function (request) {
  request.models.User.findAll({
    where: {
      isBanned: true,
      server: request.message.guild.id,
      category: request.message.channel.parentID,
    },
  }).then((users) => {
    request.message.author.send(
      "Usuários banidos:",
      users.reduce((acc, val) => `${val}, ${acc}`, "")
    );
  });
};

const adminMutarActionExec = function (request) {
  const self = request.message.member;
  const [target] = request.args;

  switch (target) {
    case "todos":
      self.voice.channel.members.forEach((member) => {
        if (member.id !== self.id) {
          member.voice.mute(true);
        }
      });
      break;

    case "lideres":
      request.models.Group.findAll().then((groups) => {
        self.voice.channel.members.forEach((member) => {
          if (
            member.id !== self.id &&
            groups.filter(
              (group) => group.leader === member.user.id.toString() <= 0
            )
          ) {
            member.voice.mute(true);
          }
        });
      });
      break;

    case "admins":
      request.models.User.findAll({
        where: ["serverLevel >= ?", MINIMUM_LEVEL],
      }).then((users) => {
        self.voice.channel.members.forEach((member) => {
          if (
            member.id !== self.id &&
            users.filter(
              (user) =>
                user.discordIdentifier === member.user.id.toString() <= 0
            )
          ) {
            member.voice.mute(true);
          }
        });
      });
      break;

    default:
      break;
  }
};

const adminDesmutarActionExec = function (request) {
  request.message.member.voice.channel.members.forEach((member) => {
    member.voice.mute(false);
  });
};

const adminStartupActionExec = function (request) {
  if (request.args.length < 1) {
    // no basic registred role
    return;
  }

  const [roleName, partySize] = request.args;

  request.message.guild.roles.cache.forEach((role) => {
    if (role.name === roleName) {
      request.models.Config.findOne({
        where: {
          server: request.message.guild.id,
          category: request.message.channel.parentID,
        },
      }).then((config) => {
        if (config) {
          request.models.Config.update(
            {
              registredRole: role.id,
              partySize: partySize || 0,
            },
            {
              where: {
                id: config.id,
              },
            }
          );
        } else {
          request.models.Config.create({
            registredRole: role.id,
            partySize: partySize || 0,
            server: request.message.guild.id,
            category: request.message.channel.parentID,
          });
        }

        request.message.reply("Ok");
      });
    }
  });
};

const adminLevelActionExec = function (request) {
  if (request.args.length < 2) {
    // no name or
    return;
  }

  const [name, level] = request.args;

  request.models.User.update(
    { serverLevel: level },
    { where: { gameName: name } }
  )
    .then(() => {
      request.message.reply("Ok");
    })
    .catch(() => {
      request.message.reply("Failed");
    });
};

const actions = {
  ajuda: new BaseAction(MINIMUM_LEVEL, adminAjudaActionExec),
  grupos: new BaseAction(MINIMUM_LEVEL, adminGruposActionExec),
  estatisticas: new BaseAction(MINIMUM_LEVEL, adminEstatisticasActionExec),
  kick: new BaseAction(MINIMUM_LEVEL, adminKickActionExec),
  banir: new BaseAction(MINIMUM_LEVEL, adminBanirActionExec),
  banimentos: new BaseAction(MINIMUM_LEVEL, adminBanimentosActionExec),
  avisar: new BaseAction(MINIMUM_LEVEL, adminAvisarActionExec),
  avisos: new BaseAction(MINIMUM_LEVEL, adminAvisosActionExec),
  mutar: new BaseAction(MINIMUM_LEVEL, adminMutarActionExec),
  desmutar: new BaseAction(MINIMUM_LEVEL, adminDesmutarActionExec),
  startup: new BaseAction(MINIMUM_LEVEL, adminStartupActionExec),
  "grupo-eliminar": new BaseAction(MINIMUM_LEVEL, adminGrupoEliminarAtionExec),
  level: new BaseAction(MINIMUM_LEVEL, adminLevelActionExec),
};

module.exports = {
  admin: new BaseAction(MINIMUM_LEVEL, adminActionExec, actions),
};
