import { Entity } from './entity';
import { EntityFamily } from './entity-family';
import { IRawState } from './observable-state';
import { Identifier, Type } from './types';

/**
 * Manage the store instance
 */
export class EntityCollection {
  private entries = new Map<Type, EntityFamily>();

  set(type: Type, store: Entity, id?: Identifier) {
    const instancesMap = this.entries.get(type);
    if (instancesMap) {
      instancesMap.set(id || type, store);
    } else {
      const storeFamily = new EntityFamily();
      storeFamily.set(id || type, store);
      this.entries.set(type, storeFamily);
    }
  }

  get(type: Type, id?: Identifier) {
    const instancesMap = this.entries.get(type);

    if (id) {
      return instancesMap?.get(id);
    } else {
      return instancesMap?.get(type);
    }
  }

  getFamily<S extends IRawState = IRawState>(type: Type) {
    return this.entries.get(type) as EntityFamily<S> | undefined;
  }

  has(type: Type, id?: Identifier) {
    const instancesMap = this.entries.get(type);
    if (id) {
      return instancesMap?.has(id);
    } else {
      return instancesMap?.has(type);
    }
  }

  remove(type: Type, id?: Identifier) {
    const instancesMap = this.entries.get(type);
    instancesMap?.remove(id || type);
  }
}
