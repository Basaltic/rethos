import { Store } from './store';
import { StoreCollection } from './store-collection';
import { IStoreDescriptor } from './store-descriptor';
import { IStoreRegistry, StoreRegistry } from './store-registry';
import { StoreStateUpdateTracker } from './store-state-update-tracker';
import { Identifier, StoreType } from './types';

export interface IStoreContainer {
  /**
   * Add New Store Descriptor
   *
   * @param discriptor
   */
  add(discriptor: IStoreDescriptor): void;

  /**
   * Get Store Instance
   *
   * @param type
   * @param id
   */
  get(type: StoreType): Store | undefined;

  /**
   * Dispose
   *
   * @param type
   * @param id
   */
  dispose(type: StoreType, id: Identifier): void;
}

export class StoreContainer implements IStoreContainer {
  private registry: IStoreRegistry;
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
    this.registry = new StoreRegistry();
    this.collection = new StoreCollection();

    this.updateTracker = new StoreStateUpdateTracker();
    this.executionStack = [];
  }

  add(discriptor: IStoreDescriptor | any): void {
    this.registry.register(discriptor);

    const store = new Store(discriptor, this.updateTracker, this.executionStack);
    this.collection.set(discriptor.type, store);
  }

  get(type: any): Store | undefined {
    return this.collection.get(type);
  }

  dispose(type: any, id: Identifier): void {
    const store = this.get(type);
    store?.dispose(id);
  }
}
