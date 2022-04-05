import { createProxyAction, IStoreActions } from './store-actions';
import { StoreActionsContainer } from './store-actions-container';
import { StoreQuery } from './store-query';
import { IStoreState } from './store-state';
import { StoreStateContainer } from './store-state-container';
import { StoreStateUpdateTracker } from './store-state-update-tracker';
import { Type, TUpdateFn, Id } from './types';

export interface IStore {
  /**
   * Add state to the store
   *
   * @param type
   * @param state
   */
  addState<S extends IStoreState>(type: Type, state: S): IStore;
  /**
   * Add actions to the store
   * @param type
   * @param actions
   */
  addActions<A extends IStoreActions>(type: Type, actions: A): IStore;
}

export class Store {
  private stateContainer: StoreStateContainer;

  private actionsContainer: StoreActionsContainer;

  /**
   * Track the execution of the action
   */
  private actionExecutionStack: Function[] = [];

  private query: StoreQuery;
  private tracker: StoreStateUpdateTracker;

  constructor() {
    const tracker = new StoreStateUpdateTracker();
    const stateContainer = new StoreStateContainer(tracker);
    const actionsContainer = new StoreActionsContainer();

    const query = new StoreQuery(stateContainer, actionsContainer);

    this.stateContainer = stateContainer;
    this.actionsContainer = actionsContainer;
    this.query = query;
    this.tracker = tracker;
  }

  addState<S extends IStoreState>(type: Type, state: S) {
    this.stateContainer.addState(type, state);
    return this;
  }

  addActions<A extends IStoreActions>(type: Type, actions: A) {
    const proxyActions = createProxyAction(actions, this.query, this.tracker, this.actionExecutionStack);
    this.actionsContainer.addActions(type, proxyActions);
    return this;
  }

  getState<S extends IStoreState>(type: Type, updateFn: TUpdateFn, id?: Id) {
    return this.stateContainer.getSubscribableState<S>(type, updateFn, id);
  }

  getActions<A extends IStoreActions>(type: Type) {
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
