import { it, expect } from 'vitest';
import { SingleStore } from '../../lib/single-store';

const createStore = () => {
  const store = new SingleStore(
    {
      count: 1,
    },
    {
      inc: s => {
        s.count += 1;
      },
      dec: s => {
        s.count -= 1;
      },
    }
  );

  return store;
};

it('simple counter test', () => {
  const store = createStore();

  const uf1 = () => {};

  const state = store.getState(uf1);
  const action = store.getAction();

  expect(state.count).toBe(1);

  action.inc();
  expect(state.count).toBe(2);

  action.dec();
  expect(state.count).toBe(1);

  action.inc();
  action.inc();
  expect(state.count).toBe(3);
});

it('multi count test', () => {
  const store = createStore();

  const uf1 = () => {};
  const uf2 = () => {};
  const uf3 = () => {};

  const state1 = store.getState(uf1);
  const state2 = store.getState(uf2);
  const state3 = store.getState(uf3);
  const action = store.getAction();

  expect(state1.count).toBe(1);
  expect(state2.count).toBe(1);
  expect(state3.count).toBe(1);

  action.inc();

  expect(state1.count).toBe(2);
  expect(state2.count).toBe(2);
  expect(state3.count).toBe(2);

  action.dec();

  expect(state1.count).toBe(1);
  expect(state2.count).toBe(1);
  expect(state3.count).toBe(1);

  store.cleanUpdate(uf1);
});
