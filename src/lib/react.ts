import { createContext, useContext } from 'react';
import { useForceUpdate } from '../hooks/use-force-update';
import { Store } from './store';
import { ExtractActions, IStoreActions } from './store-actions';
import { IStoreContainer } from './store-container';
import { IStoreState } from './store-state';
import { StoreType, Identifier } from './types';

const Context = createContext<IStoreContainer>(null as any);

export const Provider = Context.Provider;

function useStore(type: StoreType) {
  const storeContainer = useContext(Context) as IStoreContainer;
  const store = storeContainer.get(type);
  return store as Store;
}

/**
 * A hook to subsribe state change in store
 *
 * @param type
 * @param id
 * @returns
 */
export function useSubscribableState<S extends IStoreState>(type: StoreType, id?: Identifier) {
  const store = useStore(type);
  const updateFn = useForceUpdate();
  const state = store?.getSubscribableState(updateFn, id);
  return state as S;
}

/**
 *
 * @param type
 */
export function useStoreActions<A extends IStoreActions<any>>(type: StoreType, id?: Identifier) {
  const store = useStore(type);
  const actions = store.getActions(id);
  return actions as ExtractActions<A>;
}
