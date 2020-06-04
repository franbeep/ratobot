const { genWaitlistEmbed } = require("./actions/base");

const setupListeningReactionMessages = (client, models) => {
  console.log("Listening to messages...");

  // models.Config.findAll().then(configs => {
  //   configs.forEach(config => {

  //   })
  // });

  client.on("messageReactionAdd", async (reaction, user) => {
    if (user.bot) {
      return;
    }

    console.log(123);

    const configs = await models.Config.findAll();
    // When we receive a reaction we check if the reaction is partial or not
    if (reaction.partial) {
      // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
      try {
        await reaction.fetch();
      } catch (error) {
        console.log("Something went wrong when fetching the message: ", error);
        // Return as `reaction.message.author` may be undefined/null
        return;
      }
    }

    configs.forEach((config) => {
      if (config.waitlistBoardMessage === reaction.message.id) {
        switch (reaction.emoji.name) {
          case "⏫":
            // join queue
            console.log(`${user.tag} reacted up!`);
            break;

          case "⏬":
            // leave queue
            console.log(`${user.tag} reacted down!`);
            break;

          default:
            console.log(`${user.tag} reacted with ${reaction.emoji.name}`);
            break;
        }
      }
    });
  });
};

const removeInactiveGroups = (models) => {
  models.Group.findAll().then((groups) => {
    groups.forEach((group) => {
      models.User.findAll({ where: { groupId: group.id } }).then((users) => {
        if (users.length <= 0) {
          models.Group.destroy({ where: { id: group.id } });
          console.log(`Group ${group.id} removed.`);
        }
      });
    });
  });
};

const listenWaitlistMessage = (message, config, models) => {
  message.awaitReactions(async (reaction, user) => {
    if (user.bot) {
      return;
    }

    reaction.message.reactions.removeAll();
    reaction.message.react("⏫").then(() => reaction.message.react("⏬"));

    if (!["⏫", "⏬"].includes(reaction.emoji.name)) {
      return;
    }

    const [modelUser] = await models.User.findAll({
      where: { discordIdentifier: user.id },
    });

    if (!modelUser) {
      return;
    }

    if (reaction.emoji.name === "⏫") {
      // join queue
      await models.Queue.create({
        userId: modelUser.id,
        server: reaction.message.guild.id,
        category: reaction.message.channel.parentID,
      }).catch((err) => {
        console.log(
          "Error: not possible to create queue item. Probably duplicate."
        );
      });
    }
    if (reaction.emoji.name === "⏬") {
      // leave queue
      await models.Queue.destroy({
        where: {
          userId: modelUser.id,
          server: reaction.message.guild.id,
          category: reaction.message.channel.parentID,
        },
      }).catch((err) => {
        console.log("Error: not possible to destroy queue item.");
      });
    }

    models.Queue.findAll({
      where: {
        server: reaction.message.guild.id,
        category: reaction.message.channel.parentID,
      },
      include: [{ model: models.User }],
      order: [["createdAt", "ASC"]],
    }).then((queue) => {
      const waitlistMessage = genWaitlistEmbed(queue);
      // console.log("waitlistMessage:", waitlistMessage);
      reaction.message.edit({ embed: waitlistMessage });
    });
  });
};

module.exports = {
  setupListeningReactionMessages,
  removeInactiveGroups,
  listenWaitlistMessage,
};
