import camelize from '../SM&BT/camelize';

const _statesProp = {
  canState(state) {
    return Reflect.has(this.states, state);
  },
  canTransition(transition) {
    return Reflect.has(this.transitions, transition);
  },
  getStates() {
    return Object.keys(this.states);
  },
  getTransitions() {
    return Object.keys(this.transitions);
  },
};

const _stateMachine = {
  getInit(sm) {
    if (Reflect.has(sm, 'init')) {
      switch (typeof sm.init) {
        case 'string':
          return sm.init;
        case 'object':
          if (Reflect.has(sm.init, 'name')) {
            return sm.init.name;
          }
          return 'none';
        default:
          return 'none';
      }
    }
    return 'none';
  },
  getMethods(methods, that) {
    const tmp = {};
    Object.keys(methods).forEach((key) => {
      tmp[key] = methods[key].bind(that);
    });
    return tmp;
  },
  getLifeCycle(array, target, context, methods) {
    Reflect.defineProperty(target, 'lifeCycle', {
      value: {},
    });

    array.forEach((method) => {
      const name = camelize.prepend(context, method);
      if (Reflect.has(methods, name)) {
        Reflect.defineProperty(target.lifeCycle, method, {
          value: methods[name],
        });
      } else {
        Reflect.defineProperty(target.lifeCycle, method, {
          value: () => {},
        });
      }
    });
  },
  getStatesLifeCycle(target, context, methods) {
    this.getLifeCycle(['onEnter', 'onLeave'], target, context, methods);
  },
  getTransitionsLifeCycle(target, context, methods) {
    this.getLifeCycle(['on', 'onBefore', 'onAfter'], target, context, methods);
  },
  getStates(states, methods) {
    const tmp = {};

    states.forEach((state) => {
      const { name, from, to } = state;

      if (Reflect.has(tmp, from)) {
        const target = tmp[from];
        target.transitions[name] = to;
        target.states[to] = name;
      } else {
        tmp[from] = Object.create(_statesProp);
        const target = tmp[from];
        target.transitions = {
          [name]: to, // unable to change!
        };
        target.states = {
          [to]: name,
        };
        if (!Reflect.has(target, 'lifeCycle')) {
          this.getStatesLifeCycle(target, from, methods);
        }
      }
      if (!Reflect.has(tmp, to)) {
        tmp[to] = Object.create(_statesProp);
        const target = tmp[to];
        target.transitions = {};
        target.states = {};
        if (!Reflect.has(target, 'lifeCycle')) {
          this.getStatesLifeCycle(target, to, methods);
        }
      }
    });

    return tmp;
  },
  getTransitions(transitions, methods) {
    const tmp = {};

    transitions.forEach((transition) => {
      const { name } = transition;

      if (!Reflect.has(tmp, name)) {
        tmp[name] = {};
        this.getTransitionsLifeCycle(tmp[name], name, methods);
      }
    });

    return tmp;
  },
};

const stateMachineProp = {
  is(state) {
    return this._fsm.state === state;
  },
  canState(state) {
    return this._getTarget().canState(state);
  },
  canTransition(transition) {
    return this._getTarget().canTransition(transition);
  },
  goto(state) {
    const target = this._getTarget();
    if (target.canState(state)) {
      const transition = target.states[state];
      this._run(transition);
    } else {
      throw new Error('Unable for the state change!');
    }
  },
  states() {
    return this._getTarget().getStates();
  },
  allStates() {
    return Object.keys(this._fsm.states);
  },
  transitions() {
    return this._getTarget().getTransitions();
  },
  allTransitions() {
    return Object.keys(this._fsm.transitions);
  },
  _getTarget() {
    return this._fsm.states[this._fsm.state];
  },
  _run(transition) {
    const target = this._getTarget();
    if (target.canTransition(transition)) {
      const transitionLifeCycle = this._fsm.transitions[transition].lifeCycle;
      const enterState = target.transitions[transition];
      const enter = this._fsm.states[enterState].lifeCycle;
      const leave = target.lifeCycle;
      transitionLifeCycle.onBefore();
      leave.onLeave();
      transitionLifeCycle.on();
      enter.onEnter();
      this._fsm.state = enterState;
      transitionLifeCycle.onAfter();
    } else {
      throw new Error('Unable for the transition!');
    }
  },
};

export default function (sm, that) {
  const stateMachine = Object.create(stateMachineProp);
  const init = _stateMachine.getInit(sm);
  const methods = _stateMachine.getMethods(sm.methods, that || sm);
  const states = _stateMachine.getStates(sm.transitions, methods);
  const transitions = _stateMachine.getTransitions(sm.transitions, methods);
  stateMachine._fsm = {
    state: init,
    states,
    transitions,
  };

  Reflect.defineProperty(stateMachine, 'state', {
    get() {
      return this._fsm.state;
    },
    set() {
      throw new Error('Use transitions to change state!');
    },
  });

  return new Proxy(stateMachine, {
    get(target, property) {
      if (Reflect.has(target, property)) {
        return target[property];
      }
      return () => target._run(property);
    },
  });
}
