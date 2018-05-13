
cc.Class({
  extends: cc.Component,

  properties: {
    background: {
      default: null,
      type: cc.Sprite,
    },
    logo: {
      default: null,
      type: cc.Sprite,
    },
    label: {
      default: null,
      type: cc.Label,
    },
    backgroundContent: {
      default: [],
      type: cc.SpriteFrame,
    },
    logoContent: {
      default: [],
      type: cc.SpriteFrame,
    },
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.node.on('mousedown', this.click, this);
  },

  init(label) {
    this.labelContent = label;
    this.updateData(label);
  },

  click() {
    const eventCustom = new cc.Event.EventCustom('speciesNodeClick', true);
    eventCustom.setUserData({
      species: this.labelContent,
    });
    this.scheduleOnce(() => {
      this.node.dispatchEvent(eventCustom);
    }, 1);
  },

  command() {

  },

  updateData() {
    this.label.string = this.labelContent;
  },

  // update (dt) {},
});
