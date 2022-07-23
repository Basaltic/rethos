import { createStoreDescriptor, IStoreState } from '../../../../../src/main';
import { storeContainer } from '../../../store';

export interface ISimpleCounterState {
  count: number;
  test: string;
}

const defaultState: ISimpleCounterState = {
  count: 10,
  test: '',
};

export const simpleCounterStoreDescriptor = createStoreDescriptor({
  name: 'counter',
  state: defaultState,
  actions: {
    inc: (state, incNum?: number) => {
      if (incNum) {
        state.count += incNum;
      } else {
        state.count++;
      }
    },
    dec: (state) => {
      state.count--;
    },
  },
});

storeContainer.add(simpleCounterStoreDescriptor);

export const ISimpleCounterStoreType = simpleCounterStoreDescriptor.type;
export type ISimpleCounterStoreDescriptor = typeof simpleCounterStoreDescriptor;
export type ISimpleCounterStoreState = ISimpleCounterStoreDescriptor['state'];
export type ISimpleCounterStoreActions = ISimpleCounterStoreDescriptor['actions'];
