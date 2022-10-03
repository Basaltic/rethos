import { Entity } from './entity';
import { Identifier } from './types';

/**
 * Manage store instance with same (state, actions) structure which identified by id
 */
export class EntityFamily {
  private collection = new Map<Identifier, Entity>();

  set(id: Identifier, storeInstance: Entity) {
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
