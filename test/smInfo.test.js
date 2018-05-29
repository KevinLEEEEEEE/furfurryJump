import stateMachine from '../assets/Script/AI design/SM&BT/stateMachine';

const assert = require('assert');

describe('smInfo', () => {
  const sm = {
    init: 'solid',
    transitions: [
      { name: 'melt', from: 'solid', to: 'liquid' },
      { name: 'freeze', from: 'liquid', to: 'solid' },
      { name: 'vaporize', from: 'liquid', to: 'gas' },
      { name: 'condense', from: 'gas', to: 'liquid' },
    ],
    methods: {
      onBeforeMelt() { },
      onLeaveSolid() { },
      onMelt() { },
      onEnterLiquid() { },
      onAfterMelt() { },
      onFreeze() { },
      onVaporize() { },
      onCondense() { },
    },
  };
  it('info_Transition', () => {
    const SM = stateMachine(sm, sm);
    assert.equal(sm.init, SM.state);
    assert.deepEqual(SM.transitions(), ['melt']);
    assert.deepEqual(SM.allTransitions(), ['melt', 'freeze', 'vaporize', 'condense']);
    assert.deepEqual(SM.states(), ['liquid']);
    assert.deepEqual(SM.allStates(), ['solid', 'liquid', 'gas']);
    SM.melt();
    assert.equal(SM.state, 'liquid');
    assert.deepEqual(SM.transitions(), ['freeze', 'vaporize']);
    assert.deepEqual(SM.allTransitions(), ['melt', 'freeze', 'vaporize', 'condense']);
    assert.deepEqual(SM.states(), ['solid', 'gas']);
    assert.deepEqual(SM.allStates(), ['solid', 'liquid', 'gas']);
  });
  it('info_Goto', () => {
    const SM = stateMachine(sm, sm);
    assert.equal(sm.init, SM.state);
    assert.deepEqual(SM.transitions(), ['melt']);
    assert.deepEqual(SM.allTransitions(), ['melt', 'freeze', 'vaporize', 'condense']);
    assert.deepEqual(SM.states(), ['liquid']);
    assert.deepEqual(SM.allStates(), ['solid', 'liquid', 'gas']);
    SM.goto('liquid');
    assert.equal(SM.state, 'liquid');
    assert.deepEqual(SM.transitions(), ['freeze', 'vaporize']);
    assert.deepEqual(SM.allTransitions(), ['melt', 'freeze', 'vaporize', 'condense']);
    assert.deepEqual(SM.states(), ['solid', 'gas']);
    assert.deepEqual(SM.allStates(), ['solid', 'liquid', 'gas']);
  });
});
