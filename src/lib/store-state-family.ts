import { IStoreState, StoreState } from './store-state';
import { StoreStateUpdateTracker } from './store-state-update-tracker';
import { Identifier } from './types';

/**
 * Store State faimly is a set of state instances with same state structs.
 */
export class StoreStateFamily<S extends IStoreState> {
  /**
   * Single Store Created In this family
   */
  private singleStoreCollection = new Map<Identifier, StoreState<S>>();

  /**
   * Default Single Store in this family if no "Id" passed
   */
  private defaultSingleStore!: StoreState<S>;

  constructor(private rawState: S, private tracker: StoreStateUpdateTracker) {}

  /**
   * Lazy init & get store by id
   *
   * @param {Identifier} [id]
   * @returns
   */
  getStoreState = (id?: Identifier) => {
    if (id) {
      let store = this.singleStoreCollection.get(id);
      if (!store) {
        // quickly clone the state
        const ss = JSON.parse(JSON.stringify(this.rawState));
        store = new StoreState<S>(ss, this.tracker);
        this.singleStoreCollection.set(id, store);
      }
      return store;
    }

    if (!this.defaultSingleStore) {
      const ss = JSON.parse(JSON.stringify(this.rawState));
      this.defaultSingleStore = new StoreState<S>(ss, this.tracker);
    }

    return this.defaultSingleStore;
  };

  remoteStoreState = (id: Identifier) => {
    this.singleStoreCollection.delete(id);
  };
}
