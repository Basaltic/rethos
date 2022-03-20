import { useEffect, useMemo } from 'react';
import { useForceUpdate } from './hooks/use-force-update';
import { ISingleStoreConfigs } from './lib/single-store';
import { StoreFaimly } from './lib/store-family';
import { TState, TAction, ExtractAction, StoreId } from './lib/types';
import { isObject } from './utils/is-object';

export type StoreConfig = Omit<ISingleStoreConfigs, 'id'>;

/**
 * Create A Store
 *
 * @param {Object} state a object represent the state, MUST BE A OBJECT!!
 * @param {TAction} action a collection of action that change the state in the store
 * @returns [useState, getActions]
 */
export function createStore<S extends TState, A extends TAction<S>>(state: S, action: A, config?: StoreConfig) {
  if (!isObject(state)) {
    throw new Error('object required');
  }

  const storeFaimly = new StoreFaimly<S, A>(state, action, config);

  return {
    /**
     * State auto-subscribe hook, bind it to the react FC component
     *
     * @param {StoreId} [id]
     * @returns
     */
    useState: (id?: StoreId) => {
      const forceUpdate = useForceUpdate();

      const state = useMemo(() => {
        const store = storeFaimly.getStore(id);
        return store.getState(forceUpdate);
      }, [id, forceUpdate]);

      useEffect(
        () => () => {
          const store = storeFaimly.getStore(id);
          store.cleanUpdate(forceUpdate);
        },
        [id, forceUpdate],
      );

      return state as S;
    },
    /**
     * Get the state which can only be read but not modified
     *
     * @param {StoreId} [id]
     * @returns
     */
    getState: (id?: StoreId) => storeFaimly.getStore(id).getState() as S,
    /**
     * Get actions of the store
     *
     * @param {StoreId} [id]
     * @returns
     */
    getActions: (id?: StoreId) => storeFaimly.getStore(id).getAction() as ExtractAction<A>,
  };
}
