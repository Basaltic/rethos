import { createProxyAction } from './store-actions';
import { IStoreDescriptor } from './store-descriptor';
import { IStoreState, StoreState } from './store-state';
import { StoreStateUpdateTracker } from './store-state-update-tracker';
import { TUpdateFn, Identifier } from './types';

export class Store<S extends IStoreState = IStoreState> {
  public id?: Identifier;
  private descriptor: IStoreDescriptor;

  /**
   * Default Single Store in this family if no "Id" passed
   */
  private singleState: StoreState<S>;

  /**
   * Track the execution of the action
   */
  private executionStack: Function[];
  private updateTracker: StoreStateUpdateTracker;

  constructor(
    descriptor: IStoreDescriptor,
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
   * State is Readonly
   */
  get state() {
    return this.singleState.getReadonlyState();
  }

  getSubscribableState(updateFn: TUpdateFn = () => {}): S {
    return this.singleState.getSubscribableState(updateFn);
  }

  getActions() {
    const state = this.singleState.getChangeableState();
    const proxyActions = createProxyAction(this.descriptor.actions, state, this.updateTracker, this.executionStack);
    return proxyActions;
  }
}
