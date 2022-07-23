import { Store } from './store';
import { StoreFamily } from './store-family';
import { Identifier, StoreType } from './types';

/**
 * Manage the store instance
 */
export class StoreCollection {
  private entries = new Map<StoreType, StoreFamily>();

  set(type: StoreType, store: Store, id?: Identifier) {
    const instancesMap = this.entries.get(type);
    if (instancesMap) {
      instancesMap.set(id || type, store);
    } else {
      const storeFamily = new StoreFamily();
      storeFamily.set(id || type, store);
      this.entries.set(type, storeFamily);
    }
  }

  get(type: StoreType, id?: Identifier) {
    const instancesMap = this.entries.get(type);
    if (id) {
      return instancesMap?.get(id);
    } else {
      return instancesMap?.get(type);
    }
  }

  has(type: StoreType, id?: Identifier) {
    const instancesMap = this.entries.get(type);
    if (id) {
      return instancesMap?.has(id);
    } else {
      return instancesMap?.has(type);
    }
  }

  remove(type: StoreType, id?: Identifier) {
    const instancesMap = this.entries.get(type);
    instancesMap?.remove(id || type);
  }
}
