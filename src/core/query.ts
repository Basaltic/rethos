import { Container } from './container';
import { IRawState } from './observable-state';
import { Identifier, Type } from './types';

export interface IQuery {}

/**
 *
 */
export class MutableQuery implements IQuery {
  constructor(private container: Container) {}

  /**
   * Get a specific mutable state
   * @param type
   * @param id
   * @returns
   */
  get<S extends IRawState>(type: Type, id?: Identifier) {
    return this.container.get<S>(type, id);
  }

  /**
   * Get a entity Family
   *
   * @param type
   * @returns
   */
  getFamily(type: Type) {
    const family = this.container.getEntityFamily(type);
    return family;
  }
}
