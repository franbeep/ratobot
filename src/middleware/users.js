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

  const users = await request.models.User.findAll({
    where: {
      discordIdentifier: request.message.author.id,
      server: request.message.guild.id,
      category: request.message.channel.parentID,
    },
    include: [{ model: request.models.Group }],
  });

  const [user] = users;

  if (user) {
    request.modelUser = user;
  }

  return request;
};
