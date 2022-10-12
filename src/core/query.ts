import { Container } from './container';
import { MutableEntity } from './entity';
import { MutableEntityFamily } from './entity-family';
import { IRawState } from './observable-state';
import { Identifier, Type } from './types';

/**
 *
 */
export class MutableQuery {
  constructor(private container: Container) {}

  /**
   * Get a specific mutable state
   * @param type
   * @param id
   * @returns
   */
  get<S extends IRawState>(type: Type, id?: Identifier) {
    const entity = this.container.get<S>(type, id);
    return new MutableEntity(entity);
  }

  /**
   * Get a entity Family
   *
   * @param type
   * @returns
   */
  getFamily<S extends IRawState>(type: Type) {
    const family = this.container.getEntityFamily<S>(type);
    return family ? new MutableEntityFamily<S>(family) : undefined;
  }
}

export class ReadonlyQuery {}
