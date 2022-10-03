import { createProxyEntityProcessor, IEntityProcessors } from './processor';
import { IEntityDescriptor } from './entity-descriptor';
import { IRawState, ObservableState } from './observable-state';
import { StoreStateUpdateTracker } from './state-update-tracker';
import { TUpdateFn, Identifier } from './types';

/**
 * Manage the state and actions
 */
export class Entity<S extends IRawState = IRawState> {
  /**
   * Identifier of the store
   */
  public id?: Identifier;
  /**
   * Descriptor of the store
   */
  private descriptor: IEntityDescriptor<S>;

  /**
   * Default Single Store in this family if no "Id" passed
   */
  private singleState: ObservableState<S>;

  /**
   * Track the execution of the action
   */
  private executionStack: Function[];

  /**
   * Track the update in state
   */
  private updateTracker: StoreStateUpdateTracker;

  constructor(
    descriptor: IEntityDescriptor<S>,
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
    this.singleState = new ObservableState<S>(ss, updateTracker);
  }

  /**
   * Actions of the store
   */
  get actions() {
    return this.getLocalProcessors();
  }

  /**
   * Readonly state
   */
  get state() {
    return this.getState();
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
   *
   */
  getLocalProcessors(): IEntityProcessors<S> {
    const state = this.singleState.getChangeableState();
    const proxyActions = createProxyEntityProcessor(
      this.descriptor.actions as IEntityProcessors<any>,
      state,
      this.updateTracker,
      this.executionStack,
    );
    return proxyActions;
  }
}

export class ReadonlyEntity {}
