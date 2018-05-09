import speciesListManager from './speciesListManager';

cc.Class({
  extends: cc.Component,

  properties: {
    speciesNode: {
      default: null,
      type: cc.Prefab,
    },
    container: {
      default: null,
      type: cc.Node,
    },
    poolCount: 5,
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    const root = speciesListManager.getRoot();
    this.node.on('speciesNodeClick', this.speciesNodeClick, this);
    this.initPool();
    this.addNodes(root);
    this.category = 'classes';
  },

  speciesNodeClick(ev) {
    const targetSpecies = ev.getUserData().species;
    const subCategoryList = this.nextCategory(targetSpecies);
    this.addNodes(subCategoryList);
    ev.stopPropagation();
  },

  initPool() {
    this.pool = new cc.NodePool();
    const initCount = this.poolCount;
    for (let i = 0; i < initCount; i += 1) {
      const node = cc.instantiate(this.speciesNode);
      this.pool.put(node);
    }
  },

  getPoolNode() {
    let node = null;
    if (this.pool.size() > 0) {
      node = this.pool.get();
    } else {
      node = cc.instantiate(this.speciesNode);
    }
    return node;
  },

  returnPoolNode(node) {
    this.pool.put(node);
  },

  addNodes(list) {
    const children = this.container._children;
    if (children.length) {
      children.forEach((oldNode) => {
        this.returnPoolNode(oldNode);
      });
    }
    if (list.length) {
      list.forEach((newNode) => {
        const node = this.getPoolNode();
        node.parent = this.container;
        node.getComponent('speciesNode').init(newNode);
      });
    }
  },


  nextCategory(race) {
    const next = speciesListManager.getSubCategory(race, this.category);
    console.log(next);
  },

  // update (dt) {},
});
