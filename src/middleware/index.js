const controller = require("../controller");
const loggingMiddleware = require("./logging");
const usersMiddleware = require("./users");
// const debuggingMiddleware = require("./debugging");

const processes = [
  usersMiddleware,
  loggingMiddleware,
  controller.evaluate,
  // debuggingMiddleware,
];

module.exports = (request) => {
  if (!request.message.guild) {
    // no guild message
    return;
  }

  processes.reduce(async (previous, next) => {
    const result = await previous;
    if (!result) return next(request);
    return next(result);
  }, Promise.resolve());
};
