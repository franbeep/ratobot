const actions = require("./actions");

const hasPermission = (modelUser, action) =>
  action.level <= modelUser.serverLevel;

const evaluate = async (request) => {
  if (!Object.keys(actions).includes(request.command)) {
    return request; // not recognizable command
  }

  const actionWithArgs = actions[request.command].applyArgs(request.args);

  if (!hasPermission(request.modelUser, actionWithArgs)) {
    request.message.reply(
      " Você não tem permissão para executar este comando."
    );
    return request; // not enough permission
  }

  actionWithArgs.exec(request);

  return request;
};

module.exports = { evaluate };
