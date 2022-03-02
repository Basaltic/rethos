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
      inc: s => {
        s.count += 1;
        s.app.count += 1;
      },
      dec: s => {
        s.count -= 1;
        s.app.count -= 1;
      },
    }
  );

  return store;
};

it('multi nest count test', () => {
  const store = createStore();

  const uf1 = () => {};
  const uf2 = () => {};
  const uf3 = () => {};

  const state1 = store.getState(uf1);
  const state2 = store.getState(uf2);
  const state3 = store.getState(uf3);
  const action = store.getAction();

  expect(state1.count).toBe(1);

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

  expect(store.updateToPropKeySetMap.get(uf1)).toBeDefined();
  expect(store.observableUpdateMap.get(store.originalState).get('count').size).toBe(1);
  expect(store.observableUpdateMap.get(store.originalState).get('app').size).toBe(3);
  expect(store.observableUpdateMap.get(store.originalState.app).get('count').size).toBe(3);

  expect(store.observableUpdateMap.get(store.originalState).get('count').has(uf1)).toBe(true);
  expect(store.observableUpdateMap.get(store.originalState).get('app').has(uf1)).toBe(true);
  expect(store.observableUpdateMap.get(store.originalState.app).get('count').has(uf1)).toBe(true);

  store.cleanUpdate(uf1);

  expect(store.updateToPropKeySetMap.get(uf1)).toBeUndefined();
  expect(store.observableUpdateMap.get(store.originalState).get('count').size).toBe(0);
  expect(store.observableUpdateMap.get(store.originalState).get('app').size).toBe(2);

  expect(store.observableUpdateMap.get(store.originalState).get('count').has(uf1)).toBe(false);
  expect(store.observableUpdateMap.get(store.originalState).get('app').has(uf1)).toBe(false);
  expect(store.observableUpdateMap.get(store.originalState.app).get('count').has(uf1)).toBe(false);
});
