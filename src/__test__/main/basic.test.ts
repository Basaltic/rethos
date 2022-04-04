import { it, expect } from 'vitest';
import { Store } from '../../lib/store';
import { createType, IState, IActions, IStoreQuery } from '../../main';

const ICountState = createType();
interface ICountState extends IState {
  count: number;
}
const defaultCountState: ICountState = { count: 1 };

const ICountActions = createType();
interface ICountActions extends IActions {
  inc: (q: IStoreQuery, id?: string) => void;
  dec: (q: IStoreQuery, id?: string) => void;
}
const countActions = {
  inc: (q: IStoreQuery, id?: string) => {
    const countState = q.getState<ICountState>(ICountState, id);
    countState.count += 1;
  },
  dec: (q: IStoreQuery, id?: string) => {
    const countState = q.getState<ICountState>(ICountState, id);
    countState.count -= 1;
  },
};

it('test: simple counter', () => {
  const store = new Store();
  store.addState(ICountState, defaultCountState);
  store.addActions(ICountActions, countActions);

  const uf1 = () => {};

  const state = store.getState<ICountState>(ICountState, uf1);
  const action = store.getActions<ICountActions>(ICountActions);

  expect(state.count).toBe(1);

  action.inc();
  expect(state.count).toBe(2);

  action.dec();
  expect(state.count).toBe(1);

  action.inc();
  action.inc();
  expect(state.count).toBe(3);
});

it('test: multi counter sub', () => {
  const store = new Store();
  store.addState(ICountState, defaultCountState);
  store.addActions(ICountActions, countActions);

  const uf1 = () => {};
  const uf2 = () => {};
  const uf3 = () => {};

  const state1 = store.getState<ICountState>(ICountState, uf1);
  const state2 = store.getState<ICountState>(ICountState, uf2);
  const state3 = store.getState<ICountState>(ICountState, uf3);
  const action = store.getActions<ICountActions>(ICountActions);

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
});

it('test: multi instances', () => {
  const store = new Store();
  store.addState(ICountState, defaultCountState);
  store.addActions(ICountActions, countActions);

  const uf1 = () => {};

  const stat2Id = 'a';
  const state1 = store.getState<ICountState>(ICountState, uf1);
  const state2 = store.getState<ICountState>(ICountState, uf1, stat2Id);
  const action = store.getActions<ICountActions>(ICountActions);

  expect(state1.count).toBe(1);
  expect(state2.count).toBe(1);

  action.inc();
  action.inc(stat2Id);
  expect(state1.count).toBe(2);
  expect(state2.count).toBe(2);

  action.dec();
  action.dec(stat2Id);
  expect(state1.count).toBe(1);
  expect(state2.count).toBe(1);

  action.inc();
  action.inc();
  action.inc(stat2Id);
  expect(state1.count).toBe(3);
  expect(state2.count).toBe(2);
});
