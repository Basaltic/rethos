import { Store } from './store';
import { Identifier, StoreType } from './types';

/**
 * Manage the store instance
 */
export class StoreCollection {
  private entries = new Map<StoreType, Map<Identifier, Store>>();

  set(type: StoreType, store: Store, id?: Identifier) {
    const instancesMap = this.entries.get(type);
    if (instancesMap) {
      instancesMap.set(id || type, store);
    } else {
      const iMap = new Map<Identifier, Store>();
      iMap.set(id || type, store);
      this.entries.set(type, iMap);
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
    instancesMap?.delete(id || type);
  }
}
