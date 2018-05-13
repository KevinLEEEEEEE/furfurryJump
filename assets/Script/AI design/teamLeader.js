
const blackboardMethods = {
  subscribe(subscriber) {
    this.subscribers.add(subscriber);
    console.log(`subscribe success${subscriber}`);
  },
  notify() {
    const that = this;
    return (key, message) => {
      console.log(`get child message and boardcast: ${key} ${message}`);
      that.subscribers.forEach((subscriber) => {
        subscriber(key, message);
      });
    };
  },
};

const _blackboardMethods = {
  observe(target, receiver) {
    if (!target || typeof target !== 'object') {
      return;
    }
    Reflect.ownKeys(target).forEach((key) => {
      this.defineReactive(target, key, target[key], receiver);
    });
  },
  defineReactive(target, key, value, receiver) {
    this.observe(target[key], receiver);
    let currentValue = value;
    Reflect.defineProperty(target, key, {
      enumerable: true,
      configurable: false,
      get() {
        return currentValue;
      },
      set(newValue) {
        // notify
        receiver(key, newValue);
        currentValue = newValue;
      },
    });
  },
  getInitBlackboard() {
    const bb = Object.create(blackboardMethods);
    bb.subscribers = new Set();
    return bb;
  },
};

const blackboard = (() => {
  const bb = _blackboardMethods.getInitBlackboard();
  return new Proxy(bb, {
    set: (target, prop, value) => {
      if (!Reflect.has(target, prop)) {
        const receiver = bb.notify();
        _blackboardMethods.observe(value, receiver);
        Reflect.defineProperty(target, prop, {
          value,
        });
      } else {
        throw new Error(`${prop} has been defined in IT blackboard`);
      }
      return true;
    },
  });
})();

cc.Class({
  extends: cc.Component,

  properties: {
    container: {
      default: null,
      type: cc.Node,
    },
    individual: {
      default: null,
      type: cc.Prefab,
    },
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.initPool(2);
    this.members = [];
    this.node.on('individualReport', this.iReport, this);
  },

  start() {
    this.addNodes();
    this.addNodes();
    // console.log(blackboard);
  },

  initPool(count) {
    this.pool = new cc.NodePool();
    for (let index = 0; index < count; index += 1) {
      const node = cc.instantiate(this.individual);
      this.pool.put(node);
    }
  },

  getPoolNode() {
    let node = null;
    if (this.pool.size() > 0) {
      node = this.pool.get();
    } else {
      node = cc.instantiate(this.individual);
    }
    return node;
  },

  returnPoolNode(node) {
    this.pool.put(node);
  },

  addNodes() {
    const node = this.getPoolNode();
    this.members.push(node.getComponent('individual').command);
    node.getComponent('individual').init(blackboard, this.members.length);
    node.parent = this.container;
  },

  iReport(ev) {
    const iReport = ev.getUserData();
    console.log(`teamLeader receive report from: ${iReport.ID} - ${iReport.event}`);
    // console.log(blackboard);
    this.members.forEach((member) => {
      member(iReport);
    });
  },

});
