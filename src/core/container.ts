import { Entity } from './entity';
import { EntityCollection } from './entity-collection';
import { IEntityDescriptor } from './entity-descriptor';
import { IEntityRegistry, EntityRegistry } from './entity-registry';
import { IRawState } from './observable-state';
import { StoreStateUpdateTracker } from './state-update-tracker';
import { Identifier, Type } from './types';

/**
 * Manage all the entities and processors
 */
export class Container {
  /**
   * Keep the descriptor of stores
   */
  private registry: IEntityRegistry;
  /**
   * Keep the instances of store
   */
  private collection: EntityCollection;
  /**
   * Track the state update
   */
  private updateTracker: StoreStateUpdateTracker;
  /**
   * Track the execution of the action
   */
  private executionStack: Function[];

  constructor() {
    this.registry = new EntityRegistry();
    this.collection = new EntityCollection();

    this.updateTracker = new StoreStateUpdateTracker();
    this.executionStack = [];
  }

  /**
   * Bind Store Descriptor
   *
   * @param discriptor
   */
  register(discriptor: IEntityDescriptor | any): void {
    this.registry.register(discriptor);
  }

  /**
   * Get Store Instance
   * Lazily initialize the store instance while it is got
   *
   * @param type
   * @param id
   */
  get<S extends IRawState = IRawState>(type: Type, id?: Identifier): Entity<S> {
    const instance = this.collection.get(type, id);
    if (instance) {
      return instance as unknown as Entity<S>;
    } else {
      const descriptor = this.registry.getDescriptor(type);
      if (descriptor) {
        const instance = new Entity(descriptor, this.updateTracker, this.executionStack, id);
        this.collection.set(type, instance, id);
        return instance as unknown as Entity<S>;
      } else {
        throw new Error('no such type of entity');
      }
    }
  }

  /**
   * Get entity family
   *
   * @param type
   * @returns
   */
  getEntityFamily<S extends IRawState = IRawState>(type: Type) {
    const family = this.collection.getFamily<S>(type);
    return family;
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
