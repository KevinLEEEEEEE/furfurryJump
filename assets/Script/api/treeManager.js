const _treeManager = {
  getTreeObj(parent) {
    return {
      parent,
      children: {},
    };
  },
  convertToTree(list) {
    const { length } = { length: list.length };
    const returnObj = _treeManager.getTreeObj(null);
    let parentList = {
      root: returnObj, // ugly here
    };
    for (let i = 1; i < length; i += 1) {
      const childrenList = {};
      const currentLevel = list[i];
      const currentLevelLength = currentLevel.length;
      for (let j = 0; j < currentLevelLength; j += 1) {
        const currentNode = list[i][j];
        const currentNodeName = currentNode.name;
        let currentNodeParent = null;
        try {
          currentNodeParent = parentList[currentNode.parent];
        } catch (e) {
          throw new Error(`parent node error at -> ${i} : ${j}`);
        }
        const node = _treeManager.getTreeObj(currentNodeParent);
        currentNodeParent.children[currentNodeName] = node;
        childrenList[currentNodeName] = node;
      }
      parentList = childrenList;
    }
    return returnObj;
  },
};

const treeManager = {
  goNext(child) {
    const tmpNode = this.currentNode.children[child];
    const childrenList = Object.keys(tmpNode.children);
    this.currentNode = tmpNode;
    return childrenList;
  },
  goPrevious() {
    const tmpNode = this.currentNode.parent;
    const childrenList = Object.keys(tmpNode.children);
    this.currentNode = tmpNode;
    return childrenList;
  },
  canPrevious() {
    return !!this.currentNode.parent;
  },
  canNext(target) {
    const targetNode = this.currentNode.children[target];
    return !!Object.keys(targetNode.children).length;
  },
};

export default (list) => {
  const tree = Object.create(treeManager);
  const currentNode = _treeManager.convertToTree(list);
  const rootList = Object.keys(currentNode.children);
  tree.currentNode = currentNode;
  return {
    rootList,
    tree,
  };
};

