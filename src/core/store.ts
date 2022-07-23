import { createProxyAction, IStoreActions } from './store-actions';
import { IStoreDescriptor } from './store-descriptor';
import { IStoreState, StoreState } from './store-state';
import { StoreStateUpdateTracker } from './store-state-update-tracker';
import { TUpdateFn, Identifier } from './types';

/**
 * Manage the state and actions
 */
export class Store<S extends IStoreState = IStoreState> {
  /**
   * Identifier of the store
   */
  public id?: Identifier;
  /**
   * Descriptor of the store
   */
  private descriptor: IStoreDescriptor<S>;

  /**
   * Default Single Store in this family if no "Id" passed
   */
  private singleState: StoreState<S>;

  /**
   * Track the execution of the action
   */
  private executionStack: Function[];

  /**
   * Track the update in state
   */
  private updateTracker: StoreStateUpdateTracker;

  constructor(
    descriptor: IStoreDescriptor<S>,
    updateTracker: StoreStateUpdateTracker = new StoreStateUpdateTracker(),
    executionStack: Function[] = [],
    id?: Identifier,
  ) {
    this.id = id;
    this.descriptor = descriptor;
    this.updateTracker = updateTracker;
    this.executionStack = executionStack;

    // quickly clone the state
    const ss = JSON.parse(JSON.stringify(descriptor.state));
    this.singleState = new StoreState<S>(ss, updateTracker);
  }

  /**
   * Get State of the store
   *
   * @param updateFn
   * @returns
   */
  getState(updateFn?: TUpdateFn) {
    if (updateFn) {
      return this.singleState.getSubscribableState(updateFn);
    } else {
      return this.singleState.getReadonlyState();
    }
  }

  /**
   * Get Actions of the store
   * @returns
   */
  getActions(): IStoreActions<S> {
    const state = this.singleState.getChangeableState();
    const proxyActions = createProxyAction(this.descriptor.actions as IStoreActions<any>, state, this.updateTracker, this.executionStack);
    return proxyActions;
  }
}
