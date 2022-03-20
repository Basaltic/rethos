import { ISingleStoreConfigs, SingleStore } from './single-store';
import { StoreId, TAction, TState } from './types';

type TSingleStoreCollection<S extends TState, A extends TAction<S>> = { [key: StoreId]: SingleStore<S, A> };

export type StoreConfig = Omit<ISingleStoreConfigs, 'id'>;

/**
 * Store faimly is a set of single store with same state struct & actions
 */
export class StoreFaimly<S extends TState, A extends TAction<S>> {
  /**
   * Single Store Created In this family
   */
  private singleStoreCollection: TSingleStoreCollection<S, A> = {};

  /**
   * Default Single Store in this family if no "Id" passed
   */
  private defaultSingleStore!: SingleStore<S, A>;

  constructor(private rawState: S, private rawAction: A, private config?: StoreConfig) {}

  /**
   * Lazy init & get store by id
   *
   * @param {StoreId} [id]
   * @returns
   */
  getStore = (id?: StoreId) => {
    if (id) {
      let store = this.singleStoreCollection[id];
      if (!store) {
        // quickly clone the state
        const ss = JSON.parse(JSON.stringify(this.rawState));
        store = new SingleStore<S, A>(ss, this.rawAction, { ...this.config, id });
        this.singleStoreCollection[id] = store;
      }
      return store;
    }

    if (!this.defaultSingleStore) {
      this.defaultSingleStore = new SingleStore<S, A>(this.rawState, this.rawAction, { ...this.config, id: '' });
    }

    return this.defaultSingleStore;
  };
}
