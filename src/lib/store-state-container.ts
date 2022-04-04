import type { IStoreState } from './store-state';
import { StoreStateFamily } from './store-state-family';
import { StoreStateUpdateTracker } from './store-state-update-tracker';
import { Id, TUpdateFn, Type } from './types';

export class StoreStateContainer {
  private stateFaimlyCollection = new Map();

  constructor(private tracker: StoreStateUpdateTracker) {}

  /**
   * Get Changeable State From Container
   *
   * @param type
   * @param id
   * @returns
   */
  getChangeableState<S extends IStoreState>(type: Type, id?: Id): S {
    const stateFamily = this.stateFaimlyCollection.get(type) as StoreStateFamily<S>;
    const stateInstance = stateFamily.getStoreState(id);
    const changleableState = stateInstance.getChangableState();
    return changleableState;
  }

  /**
   * Get Subscribable State From Container
   */
  getSubscribableState<S extends IStoreState>(type: Type, updateFn: TUpdateFn, id?: Id): S {
    const stateFamily = this.stateFaimlyCollection.get(type) as StoreStateFamily<S>;
    const stateInstance = stateFamily.getStoreState(id);
    return stateInstance.getSubscribableState(updateFn);
  }

  /**
   * Add State to the container
   *
   * @param type
   * @param state
   */
  addState<S extends IStoreState>(type: Type, state: S) {
    const storeStateFamily = new StoreStateFamily(state, this.tracker);
    this.stateFaimlyCollection.set(type, storeStateFamily);
  }
}
