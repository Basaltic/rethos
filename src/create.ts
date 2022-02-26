import { useMemo } from 'react';
import { useForceUpdate } from './hooks/use-force-update';
import { TState, TAction, SingleStore } from './lib/single-store';
import { isObject } from './utils/is-object';

type Id = string | symbol;

type StoreMap<S extends TState> = { [key: Id]: SingleStore<S> };

/**
 * Create A Store
 *
 * @param {Object} state a object represent the state, MUST BE A OBJECT!!
 * @param {TAction} action a collection of action that change the state in the store
 * @returns [useState, useAction]
 */
export function create<S extends TState, A = TAction<S>>(state: S, action?: A): [(id?: Id) => S, (id?: Id) => Record<keyof A, () => void>] {
  if (!isObject(state)) {
    throw new Error('object required');
  }

  const storeMap: StoreMap<S> = {};

  let defaultStore: SingleStore<S>;

  /**
   * Lazy init & get store by id
   *
   * @param id
   * @returns
   */
  const getStore = (id?: Id) => {
    if (id) {
      let store = storeMap[id];
      if (!store) {
        let store = new SingleStore<S>(state, action || {});
        storeMap[id] = store;
      }
      return store;
    }

    if (!defaultStore) {
      defaultStore = new SingleStore(state, action || {});
    }

    return defaultStore;
  };

  /**
   * State Hook
   *
   * @param id
   * @returns
   */
  const useState = (id?: Id) => {
    const forceUpdate = useForceUpdate();

    const state = useMemo(() => {
      const store = getStore(id);
      return store.getState(forceUpdate);
    }, [id, forceUpdate]);

    return state;
  };

  /**
   * Action Hook
   *
   * @param id
   * @returns
   */
  const useAction = (id?: Id) => {
    const action = useMemo(() => getStore(id).getAction() as Record<keyof A, () => void>, [id]);
    return action;
  };

  return [useState, useAction];
}
