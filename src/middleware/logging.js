// middleware para logging das informacoes

module.exports = async (request) => {
  console.log(
    `Logging: [${request.modelUser.gameName}] sent command '${request.command}' with args: '${request.args}'`
  );

  return request;
};
