import { createProxyAction, IStoreActions } from './store-actions';
import { IStoreDescriptor } from './store-descriptor';
import { IStoreState } from './store-state';
import { StoreStateContainer } from './store-state-container';
import { StoreStateUpdateTracker } from './store-state-update-tracker';
import { StoreType, TUpdateFn, Identifier } from './types';

export interface IStore {
  /**
   * Add state to the store
   *
   * @param type
   * @param state
   */
  addState<S extends IStoreState>(type: StoreType, state: S): IStore;
  /**
   * Add actions to the store
   * @param type
   * @param actions
   */
  addActions<A extends IStoreActions>(type: StoreType, actions: A): IStore;
}

export class Store {
  private descriptor: IStoreDescriptor;

  private stateContainer: StoreStateContainer;

  /**
   * Track the execution of the action
   */
  private executionStack: Function[];
  private updateTracker: StoreStateUpdateTracker;

  constructor(
    descriptor: IStoreDescriptor,
    updateTracker: StoreStateUpdateTracker = new StoreStateUpdateTracker(),
    executionStack: Function[] = [],
  ) {
    this.descriptor = descriptor;

    const stateContainer = new StoreStateContainer(descriptor.state, updateTracker);

    this.updateTracker = updateTracker;
    this.executionStack = executionStack;
    this.stateContainer = stateContainer;
  }

  getReadonlyState(id?: Identifier) {
    return this.stateContainer.getReadonlyState(id);
  }

  getChangeableState(id?: Identifier) {
    return this.stateContainer.getChangeableState(id);
  }

  getSubscribableState(updateFn: TUpdateFn, id?: Identifier) {
    return this.stateContainer.getSubscribableState(updateFn, id);
  }

  getActions(id?: Identifier) {
    const state = this.stateContainer.getChangeableState(id);
    const proxyActions = createProxyAction(this.descriptor.actions, state, this.updateTracker, this.executionStack);
    return proxyActions;
  }
}
