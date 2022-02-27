import { it, expect } from 'vitest';
import { SingleStore } from '../../lib/single-store';

const createStore = () => {
  const store = new SingleStore(
    {
      count: 1,
      app: {
        count: 1,
      },
    },
    {
      inc: (s) => {
        s.count += 1;
        s.app.count += 1;
      },
      dec: (s) => {
        s.count -= 1;
        s.app.count -= 1;
      },
    },
  );

  return store;
};

it('simple nest counter test', () => {
  const store = createStore();
  const state = store.getState();
  const action = store.getAction();

  expect(state.app.count).toBe(1);

  action.inc();
  expect(state.app.count).toBe(2);

  action.dec();
  expect(state.app.count).toBe(1);

  action.inc();
  action.inc();
  expect(state.app.count).toBe(3);
});

it('multi nest count test', () => {
  const store = createStore();

  const state1 = store.getState(() => {});
  const state2 = store.getState(() => {});
  const state3 = store.getState(() => {});
  const action = store.getAction();

  expect(state1.app.count).toBe(1);
  expect(state2.app.count).toBe(1);
  expect(state3.app.count).toBe(1);

  action.inc();

  expect(state1.app.count).toBe(2);
  expect(state2.app.count).toBe(2);
  expect(state3.app.count).toBe(2);

  action.dec();

  expect(state1.app.count).toBe(1);
  expect(state2.app.count).toBe(1);
  expect(state3.app.count).toBe(1);
});
