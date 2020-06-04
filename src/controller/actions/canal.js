const { notYetImplemented, BaseAction } = require("./base");

const MINIMUM_LEVEL = 4;

const canalActionExec = notYetImplemented;

module.exports = {
  canal: new BaseAction(MINIMUM_LEVEL, canalActionExec),
};
