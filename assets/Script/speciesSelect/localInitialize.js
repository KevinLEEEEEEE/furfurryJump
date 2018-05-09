import speciesListManager from './speciesListManager';

cc.Class({
  extends: cc.Component,

  properties: {
  },

  // LIFE-CYCLE CALLBACKS:
  onLoad() {
    speciesListManager.init();
  },

  start() {

  },

  // update (dt) {},
});
