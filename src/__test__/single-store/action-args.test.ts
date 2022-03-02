import { it, expect } from 'vitest';
import { SingleStore } from '../../lib/single-store';

const createStore = () => {
  const store = new SingleStore(
    {
      count: 1,
    },
    {
      inc: (s, i?: number) => {
        if (i !== undefined) {
          s.count += i;
        } else {
          s.count += 1;
        }
      },
      dec: s => {
        s.count -= 1;
      },
    }
  );

  return store;
};

it('test: simple counter action with args', () => {
  const store = createStore();

  const uf1 = () => {};

  const state = store.getState(uf1);
  const action = store.getAction();

  expect(state.count).toBe(1);

  action.inc(10);
  expect(state.count).toBe(11);

  action.dec();

  expect(state.count).toBe(10);

  action.inc();
  action.inc();
  expect(state.count).toBe(12);
});

it('multi count test', () => {
  const store = createStore();

  const uf1 = () => {};

  const state = store.getState(uf1);
  const action = store.getAction();

  expect(state.count).toBe(1);
  expect(state.count).toBe(1);
  expect(state.count).toBe(1);

  action.inc(5);

  expect(state.count).toBe(6);
  expect(state.count).toBe(6);
  expect(state.count).toBe(6);

  action.dec();

  expect(state.count).toBe(5);
  expect(state.count).toBe(5);
  expect(state.count).toBe(5);
});
