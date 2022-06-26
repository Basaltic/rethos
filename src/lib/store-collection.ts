import { Store } from './store';
import { StoreType } from './types';

export class StoreCollection {
  private entries = new Map<StoreType, Store>();

  set(type: StoreType, store: Store) {
    this.entries.set(type, store);
  }

  get(type: StoreType) {
    return this.entries.get(type);
  }

  has(type: StoreType) {
    return this.entries.has(type);
  }
}
