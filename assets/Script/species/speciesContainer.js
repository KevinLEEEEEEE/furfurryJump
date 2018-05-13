import treeManager from '../api/treeManager';

const speciesList = [
  [
    { name: 'root', parent: null },
  ],
  [
    { name: 'animals', parent: 'root' },
    { name: 'plants', parent: 'root' },
  ],
  [
    { name: 'reptiles', parent: 'animals' },
    { name: 'rodents', parent: 'animals' },
    { name: 'birds', parent: 'animals' },
    { name: 'trees', parent: 'plants' },
  ],
  [
    { name: 'bziler', parent: 'reptiles' },
  ],
];

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
    const speciesObj = treeManager(speciesList);
    this.speciesTree = speciesObj.tree;
    this.initPool(this.poolCount);
    this.node.on('speciesNodeClick', this.goNext, this);
    this.addNodes(speciesObj.rootList);
  },

  initPool(count) {
    this.pool = new cc.NodePool();
    for (let index = 0; index < count; index += 1) {
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

  goNext(ev) {
    const targetSpecies = ev.getUserData().species;
    if (this.speciesTree.canNext(targetSpecies)) {
      const list = this.speciesTree.goNext(targetSpecies);
      this.addNodes(list);
    } else {
      console.log(`final${targetSpecies}`);
    }
    ev.stopPropagation();
  },

  goPrevious() {
    if (this.speciesTree.canPrevious()) {
      const list = this.speciesTree.goPrevious();
      this.addNodes(list);
    } else {
      console.log('hit the top');
    }
  },

  addNodes(list) {
    const children = this.container._children;
    while (children.length) {
      this.returnPoolNode(children[0]);
    }
    list.forEach((item) => {
      const node = this.getPoolNode();
      node.getComponent('speciesNode').init(item);
      node.parent = this.container;
    });
  },
});
