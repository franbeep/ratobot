require("dotenv").config();
const models = require("./models");

const startupDeleteDB = false;

// db init
models.sequelize.sync({ force: startupDeleteDB }).then(() => {
  console.log("Connected to PostgreSQL.");

  models.User.create({
    gameName: process.env.ADMIN_GAMENAME,
    discordIdentifier: process.env.ADMIN_DISCORDIDENTIFIER,
    serverLevel: 10,
    server: process.env.ADMIN_SERVER,
    referral: "Superadmin",
    category: process.env.ADMIN_CATEGORY,
  });
});
