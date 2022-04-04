import { StoreStateContainer } from './store-state-container';
import { ExtractActions, IActions, Id, IState, Type } from './types';

export interface IStoreQuery {
  getState<S extends IState>(type: Type, id?: Id): S;
  getActions<A extends IActions>(type: Type): ExtractActions<A>;
}

/**
 * Query
 */
export class StoreQuery implements IStoreQuery {
  constructor(private stateContainer: StoreStateContainer, private actionsCollection: Map<any, any>) {}

  getState<S extends IState>(type: Type, id?: Id): S {
    return this.stateContainer.getChangeableState(type, id);
  }

  getActions<A extends IActions>(type: Type): ExtractActions<A> {
    const actions = this.actionsCollection.get(type) as ExtractActions<A>;
    return actions;
  }
}
