import { Entity } from './entity';
import { EntityCollection } from './entity-collection';
import { IEntityDescriptor, IProcessorsDescriptor } from './descriptor';
import { EntityFamily } from './entity-family';
import { IRegistry, Registry } from './registry';
import { IRawState } from './observable-state';
import { StoreStateUpdateTracker } from './state-update-tracker';
import { Identifier, Type } from './types';
import { MutableQuery } from './query';
import { createProxyProcessors } from './processor';

export interface IContainer {
  register(discriptor: IEntityDescriptor | any): void;
  get<S extends IRawState = IRawState>(type: Type, id?: Identifier): Entity<S>;
  getEntityFamily<S extends IRawState = IRawState>(type: Type): EntityFamily<S> | undefined;
}

/**
 * Manage all the entities and processors
 */
export class Container implements IContainer {
  /**
   * Keep the descriptor of stores
   */
  private registry: IRegistry;
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

  private query: MutableQuery;

  constructor() {
    this.registry = new Registry();
    this.collection = new EntityCollection();

    this.updateTracker = new StoreStateUpdateTracker();
    this.executionStack = [];

    this.query = new MutableQuery(this);
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
      const descriptor = this.registry.getDescriptor(type) as IEntityDescriptor;
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
  getEntityFamily<S extends IRawState = IRawState>(type: Type): EntityFamily<S> | undefined {
    const family = this.collection.getFamily<S>(type);
    return family;
  }

  getProcessors(type: Type) {
    const descriptor = this.registry.getDescriptor(type) as IProcessorsDescriptor;
    if (descriptor) {
      const instance = createProxyProcessors(descriptor.processors, this.query, this.updateTracker, this.executionStack);
      return instance;
    } else {
      throw new Error('no such type of processors');
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
