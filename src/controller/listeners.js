const { genWaitlistEmbed } = require("./actions/base");

const removeInactiveGroups = (models) => {
  models.Group.findAll().then((groups) => {
    groups.forEach((group) => {
      models.User.findOne({ where: { groupId: group.id } }).then((user) => {
        if (!user) {
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

    const modelUser = await models.User.findOne({
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
  removeInactiveGroups,
  listenWaitlistMessage,
};
