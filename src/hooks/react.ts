import { createContext, useContext } from 'react';
import { useForceUpdate } from './use-force-update';
import { ExtractActions, IStoreActions } from '../core/store-actions';
import { StoreContainer } from '../core/store-container';
import { IStoreState } from '../core/store-state';
import { StoreType, Identifier } from '../core/types';

const Context = createContext<StoreContainer>(null as any);

export const Provider = Context.Provider;

export function useStoreContainer() {
  const storeContainer = useContext(Context) as StoreContainer;
  return storeContainer;
}

/**
 * Get Store Instance
 *
 * @param type
 * @param id
 * @returns
 */
export function useStore(type: StoreType, id?: Identifier) {
  const storeContainer = useContext(Context) as StoreContainer;
  const store = storeContainer.get(type, id);
  return store;
}

/**
 * Subscribe Store State
 */
export function useStoreState<S extends IStoreState>(type: StoreType, id?: Identifier) {
  const store = useStore(type, id);
  const updateFn = useForceUpdate();
  const state = store?.getSubscribableState(updateFn);
  return state as S;
}

/**
 * Get Actions which can change the state value of specific store instance
 *
 * @param type
 * @param id
 * @returns
 */
export function useStoreActions<A extends IStoreActions<any>>(type: StoreType, id?: Identifier) {
  const store = useStore(type, id);
  const actions = store.getActions();
  return actions as ExtractActions<A>;
}
