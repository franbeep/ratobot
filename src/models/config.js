const config = (sequelize, Sequelize) => {
  const Config = sequelize.define(
    "Configuration",
    {
      mainVoiceChannel: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      rulesBoardMessage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      waitlistBoardMessage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      registredRole: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      server: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: true,
    }
  );

  return Config;
};

module.exports = config;
