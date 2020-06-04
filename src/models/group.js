const group = (sequelize, Sequelize) => {
  const Group = sequelize.define(
    "group",
    {
      map: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
        defaultValue: "",
      },
      leader: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
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

  Group.associate = (models) => {
    Group.hasMany(models.User, {
      as: "group",
      allowNull: true,
    });
  };

  return Group;
};

module.exports = group;
