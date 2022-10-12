import { Entity, MutableEntity } from './entity';
import { IRawState } from './observable-state';
import { Identifier } from './types';

/**
 * Manage store instance with same (state, actions) structure which identified by id
 */
export class EntityFamily<S extends IRawState = IRawState> {
  private collection = new Map<Identifier, Entity<S>>();

  set(id: Identifier, storeInstance: Entity<S>) {
    this.collection.set(id, storeInstance);
  }

  get(id: Identifier): Entity<S> | undefined {
    return this.collection.get(id);
  }

  remove(id: Identifier) {
    this.collection.delete(id);
  }

  has(id: Identifier) {
    return this.collection.has(id);
  }

  forEach(cb: (value: Entity<S>, index: number, id: Identifier) => void) {
    let i = 0;
    this.collection.forEach((v, k) => {
      cb(v, i, k);
      i++;
    });
  }
}

export class MutableEntityFamily<S extends IRawState = IRawState> {
  constructor(private family: EntityFamily<S>) {}

  has(id: Identifier) {
    return this.family.has(id);
  }

  get(id: Identifier) {
    return this.family.get(id)?.toMutableEntity();
  }

  forEach(cb: (value: MutableEntity<S>, index: number, id: Identifier) => void) {
    this.family.forEach((value: Entity<S>, index: number, id: Identifier) => {
      const e = value.toMutableEntity();
      cb(e, index, id);
    });
  }
}
