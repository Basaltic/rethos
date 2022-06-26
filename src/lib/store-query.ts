import type { IStoreActions, ExtractActions } from './store-actions';
import type { IStoreState } from './store-state';
import { StoreStateContainer } from './store-state-container';
import { StoreActionsContainer } from './store-actions-container';
import { StoreType, Identifier } from './types';

export interface IStoreQuery {
  getState<S extends IStoreState>(type: StoreType, id?: Identifier): S;
  getActions<A extends IStoreActions>(type: StoreType): ExtractActions<A>;
}

/**
 * Query
 */
export class StoreQuery implements IStoreQuery {
  constructor(private stateContainer: StoreStateContainer, private actionsContainer: StoreActionsContainer) {}

  getState<S extends IStoreState>(type: StoreType, id?: Identifier): S {
    return this.stateContainer.getChangeableState(type, id);
  }

  getActions<A extends IStoreActions>(type: StoreType): ExtractActions<A> {
    const actions = this.actionsContainer.getActions(type) as ExtractActions<A>;
    return actions;
  }
}
