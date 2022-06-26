import { store } from '../../../store';
import { createType, IStoreActions, IStoreQuery, IStoreState } from '../../../../../src/main';
import { nanoid } from 'nanoid';

export const IListState = createType('IListState');
export interface IListState extends IStoreState {
  items: string[];
}
export const listState: IListState = {
  items: [],
};

export const IListItemState = createType('IListItemState');
export interface IListItemState extends IStoreState {
  title: string;
}
export const listItemState: IListItemState = {
  title: '',
};

store.addState(IListState, listState);
store.addState(IListItemState, listItemState);

export const IListActions = createType('IListActions');
export interface IListActions extends IStoreActions {
  addListItem: (q: IStoreQuery) => void;
  removeListItem: (q: IStoreQuery, index: number) => void;
}
export const listActions: IListActions = {
  addListItem: function (q: IStoreQuery): void {
    const id = nanoid();
    const listState = q.getState<IListState>(IListState);
    listState.items.push(id);

    // 如何初始化实例？? 是否需要初始化？？
    // q.getState<IListItemState>(IListItemState);
  },
  removeListItem: function (q: IStoreQuery, index: number): void {
    const listState = q.getState<IListState>(IListState);
    listState.items.splice(index, 1);
    // 如何移除state实例？
  },
};

store.addActions(IListActions, listActions);
