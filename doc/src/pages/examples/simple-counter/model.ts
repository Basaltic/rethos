import { createType, IStoreActions, IStoreState, IStoreQuery } from '../../../../../src/main';
import { store } from '../../../store';

export const ICounterState = createType('ICounterState');
export interface ICounterState extends IStoreState {
  count: number;
}
export const defaultCounterState: ICounterState = { count: 0 };

export const ICounterActions = createType();
export interface ICounterActions extends IStoreActions {
  inc: (q: IStoreQuery, id?: string) => void;
  dec: (q: IStoreQuery, id?: string) => void;
}
export const counterActions: ICounterActions = {
  inc: (q: IStoreQuery, id?: string) => {
    const countState = q.getState<ICounterState>(ICounterState, id);
    countState.count += 1;
  },
  dec: (q: IStoreQuery, id?: string) => {
    const countState = q.getState<ICounterState>(ICounterState, id);
    countState.count -= 1;
  },
};

store.addState(ICounterState, defaultCounterState);
store.addActions(ICounterActions, counterActions);
