module.exports = async (request) => {
  request.modelUser = {
    gameName: `Not Registred - ${request.message.author.username}`,
    discordIdentifier: request.message.author.id,
    isBanned: false,
    serverLevel: 0,
    warningLevel: 0,
    server: request.message.guild.id,
    category: request.message.channel.parentID,
    referral: "",
    group: null,
  };

  const user = await request.models.User.findOne({
    where: {
      discordIdentifier: request.message.author.id,
      server: request.message.guild.id,
      category: request.message.channel.parentID,
    },
    include: [{ model: request.models.Group }],
  });

  if (user) {
    request.modelUser = user;
  }

  return request;
};
