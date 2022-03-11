import React from 'react';
import { createStore } from '../../../../src/main';

const [useCounterState, getCounterAction] = createStore({ count: 0 }, { inc: s => (s.count += 1), des: s => (s.count -= 1) });

export const SimpleCounter = () => {
  const actions = getCounterAction();
  const state = useCounterState();
  const { count } = state;

  console.log('update');
  return (
    <div>
      <div>{state.count}</div>
      <div>{count}</div>
      <br />
      <button onClick={() => actions.inc()}>inc</button>
      <button onClick={() => actions.des()}>des</button>
    </div>
  );
};
