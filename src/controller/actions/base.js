class BaseAction {
  constructor(level, exec, actions = null) {
    this.level = level;
    this.exec = exec;
    this.actions = actions;
  }

  applyArgs(args) {
    if (!this.actions) {
      return this;
    }

    const arg = args.shift();

    if (!Object.keys(this.actions).includes(arg)) {
      return this;
    }

    return this.actions[arg].applyArgs(args);
  }
}

const baseEmbed = {
  color: 0x0099ff,
  // title: "Titulo",
  author: {
    name: "Rataria",
    url: "https://github.com/franbeep/ratobot",
  },
  // description: "Descrição",
  // fields: [
  //   {
  //     name: "\u200b",
  //     value: "\u200b",
  //     inline: false,
  //   },
  // ],
  timestamp: new Date(),
  footer: {
    text: "Feito por um rato. 🐭",
  },
};

const genWaitlistEmbed = (queue) => {
  let count = 1;

  const body = {
    title: "# Lista de Espera",
    description: "**Segue pessoas que estão na lista de espera:**",
    fields: queue.reduce((acc, val) => {
      acc.push({
        // name: "Teste",
        name: "\u200b",
        value: `**${count}. ${val.user.gameName}**`,
        inline: false,
      });
      count += 1;
      return acc;
    }, []),
  };

  return {
    ...baseEmbed,
    ...body,
  };
};

const notYetImplemented = (request) => {
  request.message.reply(" Comando não implementado.");
};

module.exports = {
  BaseAction,
  baseEmbed,
  notYetImplemented,
  genWaitlistEmbed,
};
