const queue = (sequelize, Sequelize) => {
  const Queue = sequelize.define(
    "queue",
    {
      // user: {
      //   type: Sequelize.STRING,
      //   unique: true,
      //   allowNull: false,
      // },
      // position: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   defaultValue: 0,
      // },
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

  Queue.associate = (models) => {
    Queue.belongsTo(models.User);
  };

  return Queue;
};

module.exports = queue;
