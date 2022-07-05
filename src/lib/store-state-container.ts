import type { IStoreState } from './store-state';
import { StoreStateFamily } from './store-state-family';
import { StoreStateUpdateTracker } from './store-state-update-tracker';
import { Identifier, TUpdateFn } from './types';

export class StoreStateContainer<S extends IStoreState = IStoreState> {
  private stateFamily: StoreStateFamily<S>;

  constructor(state: S, private tracker: StoreStateUpdateTracker) {
    const stateFamily = new StoreStateFamily(state, this.tracker);
    this.stateFamily = stateFamily;
  }

  /**
   * Get Changeable State From Container
   *
   * @param type
   * @param id
   * @returns
   */
  getReadonlyState(id?: Identifier): S {
    const stateInstance = this.stateFamily.getStoreState(id);
    const changleableState = stateInstance.getChangableState();
    return changleableState;
  }
  /**
   * Get Changeable State From Container
   *
   * @param type
   * @param id
   * @returns
   */
  getChangeableState(id?: Identifier): S {
    const stateInstance = this.stateFamily.getStoreState(id);
    const changleableState = stateInstance.getChangableState();
    return changleableState;
  }

  /**
   * Get Subscribable State From Container
   */
  getSubscribableState(updateFn: TUpdateFn, id?: Identifier): S {
    const stateInstance = this.stateFamily.getStoreState(id);
    const subscribableState = stateInstance.getSubscribableState(updateFn);
    return subscribableState;
  }

  /**
   * Dispose the store state instance of specific id
   */
  dispose(id: Identifier) {
    this.stateFamily.remoteStoreState(id);
  }
}
