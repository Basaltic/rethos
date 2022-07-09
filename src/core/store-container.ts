import { Store } from './store';
import { StoreCollection } from './store-collection';
import { IStoreDescriptor } from './store-descriptor';
import { IStoreDiscriptorRegistry, StoreDiscriptorRegistry } from './store-registry';
import { StoreStateUpdateTracker } from './store-state-update-tracker';
import { Identifier, StoreType } from './types';

export class StoreContainer {
  /**
   * Keep the descriptor of stores
   */
  private registry: IStoreDiscriptorRegistry;
  /**
   * Keep the instances of store
   */
  private collection: StoreCollection;
  /**
   * Track the state update
   */
  private updateTracker: StoreStateUpdateTracker;
  /**
   * Track the execution of the action
   */
  private executionStack: Function[];

  constructor() {
    this.registry = new StoreDiscriptorRegistry();
    this.collection = new StoreCollection();

    this.updateTracker = new StoreStateUpdateTracker();
    this.executionStack = [];
  }

  /**
   * Add New Store Descriptor
   *
   * @param discriptor
   */
  add(discriptor: IStoreDescriptor | any): void {
    this.registry.register(discriptor);
  }

  /**
   * Get Store Instance
   * Lazily initialize the store instance while it is got
   *
   * @param type
   * @param id
   */
  get(type: StoreType, id?: Identifier): Store {
    const instance = this.collection.get(type, id);
    if (instance) {
      return instance;
    } else {
      const descriptor = this.registry.getDescriptor(type);
      if (descriptor) {
        const storeInstance = new Store(descriptor, this.updateTracker, this.executionStack, id);
        this.collection.set(type, storeInstance, id);
        return storeInstance;
      } else {
        throw new Error('no such type of store');
      }
    }
  }

  /**
   * Dispose
   *
   * @param type
   * @param id
   */
  dispose(type: any, id: Identifier): void {
    this.collection.remove(type, id);
  }
}
