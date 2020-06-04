const user = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
    {
      gameName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      discordIdentifier: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isBanned: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      serverLevel: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      warningLevel: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      server: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      referral: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
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

  User.associate = (models) => {
    User.hasOne(models.Queue, {
      foreignKey: {
        unique: true,
      },
      allowNull: false,
    });
    User.belongsTo(models.Group);
  };

  return User;
};

module.exports = user;
