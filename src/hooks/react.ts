import { createContext, useContext } from 'react';
import { useForceUpdate } from './use-force-update';
import { ExtractActions } from '../core/store-actions';
import { StoreContainer } from '../core/store-container';
import { Identifier, TUpdateFn } from '../core/types';
import { IStoreDescriptor } from '../core/store-descriptor';

const Context = createContext<StoreContainer>(null as any);

export const Provider = Context.Provider;

/**
 * Get Store Container from the context
 *
 * @returns {StoreContainer}
 */
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
function useStoreInstance<SD extends IStoreDescriptor<any>>(descriptor: SD, id?: Identifier) {
  const storeContainer = useContext(Context) as StoreContainer;
  const { type } = descriptor;
  const store = storeContainer.get(type, id);
  return store as unknown as {
    getState: (updateFn?: TUpdateFn) => typeof descriptor['state'];
    getActions: () => ExtractActions<typeof descriptor['actions']>;
  };
}

/**
 * Subscribe Store State
 */
export function useStoreState<SD extends IStoreDescriptor<any>>(descriptor: SD, id?: Identifier) {
  const updateFn = useForceUpdate();
  const store = useStoreInstance(descriptor, id);
  const state = store?.getState(updateFn);
  return state as typeof descriptor['state'];
}

/**
 * Get Actions which can change the state value of specific store instance
 *
 * @param type
 * @param id
 * @returns
 */
export function useStoreActions<SD extends IStoreDescriptor<any>>(descriptor: SD, id?: Identifier) {
  const store = useStoreInstance(descriptor, id);
  const actions = store.getActions();
  return actions as unknown as ExtractActions<typeof descriptor['actions']>;
}
