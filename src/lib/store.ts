import { createContext, useContext } from 'react';
import { useForceUpdate } from '../hooks/use-force-update';
import { StoreActionsContainer } from './store-actions-container';
import { StoreQuery } from './store-query';
import { StoreStateContainer } from './store-state-container';
import { StoreStateUpdateTracker } from './store-state-update-tracker';
import { IState, Type, IActions, TUpdateFn, Id } from './types';

export interface IStore {
  /**
   * Add state to the store
   *
   * @param type
   * @param state
   */
  addState<S extends IState>(type: Type, state: S): IStore;
  /**
   * Add actions to the store
   * @param type
   * @param actions
   */
  addActions<A extends IActions>(type: Type, actions: A): IStore;
}

export class Store {
  private stateContainer: StoreStateContainer;

  private actionsContainer: StoreActionsContainer;

  constructor() {
    const tracker = new StoreStateUpdateTracker();
    const stateContainer = new StoreStateContainer(tracker);
    const actionsCollection = new Map();

    const query = new StoreQuery(stateContainer, actionsCollection);

    const actionsContainer = new StoreActionsContainer(actionsCollection, query, tracker);

    this.stateContainer = stateContainer;
    this.actionsContainer = actionsContainer;
  }

  addState<S extends IState>(type: Type, state: S) {
    this.stateContainer.addState(type, state);
    return this;
  }

  addActions<A extends IActions>(type: Type, actions: A) {
    this.actionsContainer.addActions(type, actions);
    return this;
  }

  getState<S extends IState>(type: Type, updateFn: TUpdateFn, id?: Id) {
    return this.stateContainer.getSubscribableState<S>(type, updateFn, id);
  }

  getActions<A extends IActions>(type: Type) {
    return this.actionsContainer.getActions<A>(type);
  }
}

/**
 * Create Store Instance
 */
export const createStore = () => {
  const store: IStore = new Store();
  return store;
};

/**
 * Create Unique Type For State or Actions
 *
 * @param name give type a name will make debug easier
 * @returns
 */
export const createType: (name?: string) => Type = (name?: string) => (name ? Symbol.for(name) : Symbol());

const Context = createContext<IStore>(null as any);

export const Provider = Context.Provider;

/**
 * A hook to subsribe state change in store
 *
 * @param type
 * @param id
 * @returns
 */
export function useSubscribableState<S extends IState>(type: Type, id?: Id) {
  const updateFn = useForceUpdate();
  const store = useContext(Context) as Store;
  const state = store.getState<S>(type, updateFn, id);
  return state;
}

/**
 *
 * @param type
 */
export function useStoreActions<A extends IActions>(type: Type) {
  const store = useContext(Context) as Store;
  const actions = store.getActions<A>(type);
  return actions;
}
