const { BaseAction, baseEmbed } = require("./base");

const MINIMUM_LEVEL = 1;

const ajudaActionExec = function (request) {
  const ajudaMessage = {
    ...baseEmbed,
    title: "# Ajuda - Comandos",
    description: "**Segue lista de comandos disponíveis no bot:**",
    fields: [
      {
        name: "\u200b",
        value: `
        **!ajuda** — lista comandos para o público
        **!grupo membros** — lista membros do grupo
        **!grupo convidar <usuario>** — coloca usuario no grupo 
        **!grupo criar** — cria grupo
        **!grupo sala** — cria sala para o grupo
        **!grupo sair** — sai do grupo
        **!grupo retirar <usuario>** — retira usuario do grupo
        **!grupo mapa <nome_do_mapa>** — atribui mapa ao grupo
        **!grupo lider <usuario>** — muda lider do grupo
        **!mover** — move grupo inteiro para sala principal
        `,
      },
    ],
  };

  request.message.author.send({ embed: ajudaMessage });
};

module.exports = {
  ajuda: new BaseAction(MINIMUM_LEVEL, ajudaActionExec),
};
