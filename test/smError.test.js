import stateMachine from '../assets/Script/AI design/SM&BT/stateMachine';

const assert = require('assert');

describe('smError', () => {
  const sm = {
    init: 'solid',
    transitions: [
      { name: 'melt', from: 'solid', to: 'liquid' },
      { name: 'freeze', from: 'liquid', to: 'solid' },
      { name: 'vaporize', from: 'liquid', to: 'gas' },
      { name: 'condense', from: 'gas', to: 'liquid' },
    ],
    methods: {
      onBeforeMelt() { console.log('onBeforeMelt'); },
      onLeaveSolid() { console.log('onLeaveSolid'); },
      onMelt() { console.log('onMelt'); },
      onEnterLiquid() { console.log('onEnterLiquid'); },
      onAfterMelt() { console.log('onAfterMelt'); },
      onFreeze() { console.log('onFroze'); },
      onVaporize() { console.log('onVaporized'); },
      onCondense() { console.log('onCondensed'); },
    },
  };
  it('wrongTransition', () => {
    const SM = stateMachine(sm, sm);
    assert.equal(sm.init, SM.state);
    assert.throws(() => {
      SM.freeze();
    }, /Unable for the transition!$/);
  });
  it('wrongGoto', () => {
    const SM = stateMachine(sm, sm);
    assert.equal(sm.init, SM.state);
    assert.throws(() => {
      SM.goto('gas');
    }, /Unable for the state change!$/);
  });
  it('wrongSet', () => {
    const SM = stateMachine(sm, sm);
    assert.equal(sm.init, SM.state);
    assert.throws(() => {
      SM.state = 'forbidden';
    }, /Use transitions to change state!$/);
  });
});
