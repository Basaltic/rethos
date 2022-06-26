import { createContext, useContext } from 'react';
import { useForceUpdate } from '../hooks/use-force-update';
import { IStore, Store } from './store';
import { IStoreActions } from './store-actions';
import { IStoreState } from './store-state';
import { StoreType, Identifier } from './types';

const Context = createContext<IStore>(null as any);

export const Provider = Context.Provider;

/**
 * A hook to subsribe state change in store
 *
 * @param type
 * @param id
 * @returns
 */
export function useSubscribableState<S extends IStoreState>(type: StoreType, id?: Identifier) {
  const updateFn = useForceUpdate();
  const store = useContext(Context) as Store;
  const state = store.getState<S>(type, updateFn, id);
  return state;
}

/**
 *
 * @param type
 */
export function useStoreActions<A extends IStoreActions>(type: StoreType) {
  const store = useContext(Context) as Store;
  const actions = store.getActions<A>(type);
  return actions;
}
