import { useEffect, useMemo } from 'react';
import { useForceUpdate } from './hooks/use-force-update';
import { TState, TAction, ExtractAction, SingleStore, ISingleStoreConfigs } from './lib/single-store';
import { isObject } from './utils/is-object';

type Id = string | number | symbol;

type StoreMap<S extends TState, A extends TAction<S>> = { [key: Id]: SingleStore<S, A> };

export type StoreConfig = Omit<ISingleStoreConfigs, 'id'>;

/**
 * Create A Store
 *
 * @param {Object} state a object represent the state, MUST BE A OBJECT!!
 * @param {TAction} action a collection of action that change the state in the store
 * @returns [useState, getActions]
 */
export function createStore<S extends TState, A extends TAction<S>>(
  state: S,
  action: A,
  config?: StoreConfig,
): [(id?: Id) => S, (id?: Id) => ExtractAction<A>, (id?: Id) => S] {
  if (!isObject(state)) {
    throw new Error('object required');
  }

  const storeMap: StoreMap<S, A> = {};

  let defaultStore: SingleStore<S, A>;

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
        // quickly clone the state
        const ss = JSON.parse(JSON.stringify(state));
        store = new SingleStore<S, A>(ss, action, { ...config, id });
        storeMap[id] = store;
      }
      return store;
    }

    if (!defaultStore) {
      defaultStore = new SingleStore<S, A>(state, action, { ...config, id: '' });
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

    useEffect(
      () => () => {
        const store = getStore(id);
        store.cleanUpdate(forceUpdate);
      },
      [id, forceUpdate],
    );

    return state;
  };

  /**
   * Get Action
   *
   * @param id
   * @returns
   */
  const getAction = (id?: Id) => {
    const action = getStore(id).getAction();
    return action;
  };

  /**
   * Get the State
   * @param id
   * @returns
   */
  const getState = (id?: Id) => {
    return getStore(id).getState();
  };

  return [useState, getAction, getState];
}
