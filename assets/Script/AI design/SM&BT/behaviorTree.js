import errorHandler from './errorHandler';
import { btNode as $, btState as $$ } from '../config/btNode';

const _btNodeProperty = new Map()
  .set($.SELECTOR, {
    run() {
      for (let i = 0; i < this.children.length; i += 1) {
        if (this.children[i].run()) {
          return true;
        }
      }
      return false;
    },
  })
  .set($.SEQUENCE, {
    run() {
      for (let i = 0; i < this.children.length; i += 1) {
        if (!this.children[i].run()) {
          return false;
        }
      }
      return true;
    },
  })
  .set($.PARALLEL, {
    run() {
      const methods = this.children;
      let result = true;
      methods.forEach((method) => {
        result = result && method();
      });
      return result;
    },
  })
  .set($.CONDITION, {
    run() {
      const { name } = { name: this.name };
      return this.origin.condition[name]();
    },
  })
  .set($.ACTION, {
    run() {
      const { name } = { name: this.name };
      return this.origin.action[name]();
    },
  });

const _behaviorTree = {
  formatDetect(item) {
    return Reflect.has(item, 'name') &&
            Reflect.has(item, 'type') &&
            Reflect.has(item, 'parent');
  },
  getStructure(template, origin) {
    let root = null;
    let parents = {};
    let children = {};

    template.forEach((items, i) => {
      items.forEach((item, j) => {
        if (!this.formatDetect(item)) { // the item doesn't match the 'name' 'type' 'parent' format
          throw new Error(`Error with format of ${item}`);
        }
        const { name, type, parent } = { name: item.name, type: item.type, parent: item.parent };
        const nodePrototype = _btNodeProperty.get(type); // get prototype 'run' based of its type
        const node = Object.create(nodePrototype);
        node.name = name; // important! save the name as the name of k, c and m
        node.type = type; // save its type for further use(no use recently)
        node.state = $$.COMPLETED; // init the default state of the node
        node.origin = origin; // preserve 'this' of all knowledge , condition and methods
        node.children = []; // set children for further call
        if (Reflect.has(parents, parent)) {
          parents[parent].children.push(node); // become child of parent
          children[name] = node;
          console.log(`define '${item.name}' as child of '${parent}' successfully`);
        } else if (i === 0 && j === 0) {
          root = node; // the root node
          children[name] = node;
          console.log('define root successfully');
        } else {
          throw new Error(`Can't find parent '${item.parent}' of '${item.name}'`);
        }
      });
      parents = children; // important! exchange the direction of variables
      children = {}; // important! keep the previous level nodes as parents of next level
    });

    return root;
  },
};

const behaviorTreePrototype = {
  update() {
    // to update the knowledge ,using a formated object
  },
  run() {
    this.structure.run(); // to run the behaviour tree
  },
};

export default function newBehaviorTree(bt) {
  if (bt === null || typeof bt !== 'object') {
    throw new Error('Please use a formated object as the init object');
  }

  const BT = Object.create(behaviorTreePrototype);

  try {
    Object.keys(bt).forEach((key) => {
      switch (key) {
        case 'structure': {
          const structure = _behaviorTree.getStructure(bt.structure, BT);
          Object.freeze(structure); // set the tree structed object as new structure
          BT[key] = structure;
          break;
        }
        case 'knowledge': {
          Object.seal(bt[key]); // ensure the original properties can't be deleted or added
          BT[key] = bt[key]; // but the data can still be changed
          break;
        }
        case 'condition':
        case 'action': {
          BT[key] = {};
          Object.keys(bt[key]).forEach((childKey) => {
            BT[key][childKey] = bt[key][childKey].bind(BT); // make sure each node can get the knowledge
          });
          Object.freeze(BT[key]); // the methods and not be changed since inited
          break;
        }
        default: {
          throw new Error(`the key: ${key} is not the required property of BT`);
        }
      }
    });
  } catch (error) {
    errorHandler.console(error);
  }

  return BT;
}
