import { it, expect } from 'vitest';
import { SingleStore } from '../../lib/single-store';

const createStore = () => {
  const store = new SingleStore(
    {
      count: 1,
    },
    {
      inc: (s) => {
        s.count += 1;
      },
      dec: (s) => {
        s.count -= 1;
      },
    },
  );

  return store;
};

it('simple counter test', () => {
  const store = createStore();
  const state = store.getState();
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

  const state = store.getState();
  const action = store.getAction();

  expect(state.count).toBe(1);
  expect(state.count).toBe(1);
  expect(state.count).toBe(1);

  action.inc();

  expect(state.count).toBe(2);
  expect(state.count).toBe(2);
  expect(state.count).toBe(2);

  action.dec();

  expect(state.count).toBe(1);
  expect(state.count).toBe(1);
  expect(state.count).toBe(1);
});
