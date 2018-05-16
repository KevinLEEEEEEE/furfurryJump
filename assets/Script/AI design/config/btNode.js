const btNode = {
  SELECTOR: 1,
  SEQUENCE: 2,
  PARALLEL: 3,
  CONDITION: 4,
  ACTION: 5,
};

const btState = {
  WAIT: 0,
  RUNNING: 1,
  SUCCESS: 2,
  FAILED: 3,
};

export { btNode, btState };
