import { Store } from './store';
import { ExtractActions, IStoreActions } from './store-actions';
import { StoreCollection } from './store-collection';
import { IStoreDescriptor } from './store-descriptor';
import { IStoreRegistry, StoreRegistry } from './store-registry';
import { IStoreState } from './store-state';
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
   * Get State
   *
   * @param type
   * @param id
   */
  getState<S extends IStoreState>(type: StoreType, id: Identifier): S;

  /**
   * Get Actions
   *
   * @param type
   * @param id
   */
  getActions<A extends IStoreActions>(type: StoreType, id: Identifier): ExtractActions<A>;

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
   *
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

  add(discriptor: IStoreDescriptor): void {
    this.registry.register(discriptor);

    const store = new Store(discriptor, this.updateTracker, this.executionStack);
    this.collection.set(discriptor.type, store);
  }

  get(type: any): Store | undefined {
    return this.collection.get(type);
  }

  getState<S extends IStoreState>(type: any, id: Identifier): S {
    throw new Error('Method not implemented.');
  }
  getActions<A extends IStoreActions>(type: any, id: Identifier): ExtractActions<A> {
    throw new Error('Method not implemented.');
  }
  dispose(type: any, id: Identifier): void {
    throw new Error('Method not implemented.');
  }
}
