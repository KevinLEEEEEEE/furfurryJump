const test = cc.Enum({
  nei: 1,
  waio: 2,
});

cc.Class({
  extends: cc.Component,

  properties: {
    NPCtype: {
      default: test.nei,
      type: test,
    },
    // check: {
    //   default: false,
    //   type: cc.CheckBox,
    // },
    menu: {
      default: null,
      type: cc.Prefab,
      visible: true,
    },
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.loader('character.json');
  },

  loader(resource) {
    // const url = cc.url.raw(`${resource}`);
    cc.loader.loadRes(resource, (err, res) => {
      console.log(res);
    });
  },
  // update (dt) {},
});
