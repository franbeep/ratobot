const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT,

//     pool: {
//       max: process.env.DB_POOL_MAX,
//       min: process.env.DB_POOL_MIN,
//       acquire: process.env.DB_POOL_ACQUIRE,
//       idle: process.env.DB_POOL_IDLE,
//     },
//   }
// );

const models = {
  User: sequelize.import("./user"),
  Group: sequelize.import("./group"),
  Config: sequelize.import("./config"),
  Queue: sequelize.import("./queue"),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models,
  // queries,
};
