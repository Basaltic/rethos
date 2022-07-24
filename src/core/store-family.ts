import { Store } from './store';
import { Identifier } from './types';

/**
 * Manage store instance with same (state, actions) structure which identified by id
 */
export class StoreFamily {
  private collection = new Map<Identifier, Store>();

  set(id: Identifier, storeInstance: Store) {
    this.collection.set(id, storeInstance);
  }

  get(id: Identifier) {
    return this.collection.get(id);
  }

  remove(id: Identifier) {
    this.collection.delete(id);
  }

  has(id: Identifier) {
    return this.collection.has(id);
  }
}
