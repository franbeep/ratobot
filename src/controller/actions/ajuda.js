const { BaseAction, baseEmbed } = require("./base");

const MINIMUM_LEVEL = 0;

const ajudaActionExec = function (request) {
  const ajudaMessage = {
    ...baseEmbed,
    title: "Ajuda - Comandos",
    description: "Segue lista de comandos disponíveis no bot:",
    fields: [
      {
        name: "\u200b",
        value: "\u200b",
        inline: false,
      },
      {
        name: "Lista de comandos",
        value: "!ajuda",
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: false,
      },
      {
        name: "Comando para convidar para grupo",
        value: "!grupo convidar <usuario>",
      },
      {
        name: "Comando para criar grupo",
        value: "!grupo criar",
      },
      {
        name: "Comando para criar sala para o grupo",
        value: "!grupo sala",
      },
      {
        name: "Comando para sair do grupo",
        value: "!grupo sair",
      },
      {
        name: "Comando para excluir do grupo",
        value: "!grupo retirar <usuario>",
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: false,
      },
    ],
  };

  request.message.author.send({ embed: ajudaMessage });
};

module.exports = {
  ajuda: new BaseAction(MINIMUM_LEVEL, ajudaActionExec),
};
