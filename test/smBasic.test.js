import stateMachine from '../assets/Script/AI design/SM&BT/stateMachine';

const assert = require('assert');

describe('smBasic', () => {
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
  it('basicT', () => {
    const SM = stateMachine(sm, sm);
    assert.equal(sm.init, SM.state);
    SM.melt();
    assert.equal('liquid', SM.state);
    SM.vaporize();
    assert.equal('gas', SM.state);
    SM.condense();
    assert.equal('liquid', SM.state);
    SM.freeze();
    assert.equal('solid', SM.state);
  });
  it('basicWT', () => {
    const SM = stateMachine(sm);
    assert.equal(sm.init, SM.state);
    SM.melt();
    assert.equal('liquid', SM.state);
    SM.vaporize();
    assert.equal('gas', SM.state);
    SM.condense();
    assert.equal('liquid', SM.state);
    SM.freeze();
    assert.equal('solid', SM.state);
  });
  it('gotoT', () => {
    const SM = stateMachine(sm, sm);
    SM.goto('liquid');
    assert.equal('liquid', SM.state);
    SM.goto('gas');
    assert.equal('gas', SM.state);
    SM.goto('liquid');
    assert.equal('liquid', SM.state);
    SM.goto('solid');
    assert.equal('solid', SM.state);
  });
  it('gotoWT', () => {
    const SM = stateMachine(sm);
    SM.goto('liquid');
    assert.equal('liquid', SM.state);
    SM.goto('gas');
    assert.equal('gas', SM.state);
    SM.goto('liquid');
    assert.equal('liquid', SM.state);
    SM.goto('solid');
    assert.equal('solid', SM.state);
  });
});
