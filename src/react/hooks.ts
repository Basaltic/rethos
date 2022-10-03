import { useContext } from 'react';
import { useForceUpdate } from './use-force-update';
import { ExtractEntityProcessor } from '../core/processor';
import { Container } from '../core/container';
import { Identifier, TUpdateFn } from '../core/types';
import { IEntityDescriptor } from '../core/entity-descriptor';
import { Context } from './context';

/**
 * Get Store Container from the context
 *
 * @returns {Container}
 */
export function useContainer() {
  const storeContainer = useContext(Context) as Container;
  return storeContainer;
}

/**
 * Get Store Instance
 *
 * @param type
 * @param id
 * @returns
 */
function useStoreInstance<SD extends IEntityDescriptor<any>>(descriptor: SD, id?: Identifier) {
  const storeContainer = useContext(Context) as Container;
  const { type } = descriptor;
  const store = storeContainer.get(type, id);
  return store as unknown as {
    getState: (updateFn?: TUpdateFn) => typeof descriptor['state'];
    getActions: () => ExtractEntityProcessor<typeof descriptor['actions']>;
  };
}

/**
 * Get store state and actions
 *
 * @param descriptor
 * @param id
 * @returns
 */
export function useStore<SD extends IEntityDescriptor<any>>(descriptor: SD, id?: Identifier) {
  const updateFn = useForceUpdate();
  const storeInstance = useStoreInstance(descriptor, id);
  return {
    state: storeInstance.getState(updateFn) as typeof descriptor['state'],
    actions: storeInstance.getActions() as unknown as ExtractEntityProcessor<typeof descriptor['actions']>,
  };
}

/**
 * Subscribe Store State
 */
export function useStoreState<SD extends IEntityDescriptor<any>>(descriptor: SD, id?: Identifier) {
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
export function useStoreActions<SD extends IEntityDescriptor<any>>(descriptor: SD, id?: Identifier) {
  const store = useStoreInstance(descriptor, id);
  const actions = store.getActions();
  return actions as unknown as ExtractEntityProcessor<typeof descriptor['actions']>;
}
