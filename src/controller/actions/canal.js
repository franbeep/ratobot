const { notYetImplemented, BaseAction } = require("./base");

const MINIMUM_LEVEL = 0;

const canalActionExec = notYetImplemented;

module.exports = {
  canal: new BaseAction(MINIMUM_LEVEL, canalActionExec),
};
