
cc.Class({
  extends: cc.Component,

  properties: {

  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.node.on('mousedown', this.click, this);
  },

  click() {
    const eventCustom = new cc.Event.EventCustom('individualReport', true);
    eventCustom.setUserData({
      ID: this.number,
      event: 'click',
    });
    this.node.dispatchEvent(eventCustom);
    this.blackboard[this.number].clickNumber += 1;
  },

  init(blackboard, number) {
    this.blackboard = blackboard;
    this.number = number;
    const mates = this.mates();
    this.blackboard.subscribe(mates);
    this.blackboard[number] = {
      clickNumber: 0,
    };
  },

  command(order) {
    console.log(`receive order from commander: ${order.ID} - ${order.event}`);
  },

  mates() {
    const that = this;
    return (key, message) => {
      console.log(`receive order from mates: ${message}`);
      that.command({
        ID: key,
        event: message,
      });
    };
  },
  // update (dt) {},
});
