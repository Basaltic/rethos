import type { IStoreActions, ExtractActions } from './store-actions';
import { Type } from './types';

/**
 * Actions in Store
 */
export class StoreActionsContainer {
  private actionsCollection = new Map();
  constructor() {}

  getActions<A extends IStoreActions>(type: Type): ExtractActions<A> {
    const actions = this.actionsCollection.get(type) as ExtractActions<A>;
    return actions;
  }

  /**
   * Add actions to the containers
   *
   * @param action actions defined by the user
   * @param state the state passed to the action
   * @returns a proxy action object
   */
  addActions<A extends IStoreActions>(type: Type, actions: ExtractActions<A>) {
    this.actionsCollection.set(type, actions);
  }
}
