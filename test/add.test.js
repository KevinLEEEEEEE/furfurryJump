import newBehaviorTree from '../assets/Script/AI design/SM&BT/behaviorTree';
import { btNode as $, btState as $$ } from '../assets/Script/AI design/config/btNode';

const assert = require('assert');

describe('test', () => {
  const input = {
    structure: [
      [
        { name: 'root', type: $.SELECTOR, parent: null },
      ],
    ],
    knowledge: {
      isTest: true,
    },
    condition: {
      isTest() {
        return !this.knowledge.isTest;
      },
    },
    action: {
      toTest() {
        console.log('Test');
        return true;
      },
    },
  };

  const output = newBehaviorTree(input);

  const expect = {
    name: 'root',
    type: $.SELECTOR,
    state: $$.COMPLETED,
    children: [],
  };

  Object.defineProperty(expect, 'run', () => {
    for (let i = 0; i < this.children.length; i += 1) {
      if (this.children[i].run()) {
        return true;
      }
    }
    return false;
  });

  it('behaviorTtree', () => {
    assert.equal(output.structure, expect);
  });
});
