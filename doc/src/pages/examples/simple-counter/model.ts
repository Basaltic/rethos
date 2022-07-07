import { createStoreDescriptor } from '../../../../../src/main';
import { storeContainer } from '../../../store';

const simpleCounterStoreDescriptor = createStoreDescriptor({
  name: 'simple_counter',
  state: {
    count: 0,
  },
  actions: {
    inc: (state) => {
      state.count++;
    },
    dec: (state) => {
      state.count--;
    },
  },
});

storeContainer.add(simpleCounterStoreDescriptor);

export const ISimpleCounterStore = simpleCounterStoreDescriptor.type;
export type ISimpleCounterStore = typeof simpleCounterStoreDescriptor;
export type ISimpleCounterStoreState = ISimpleCounterStore['state'];
export type ISimpleCounterStoreActions = ISimpleCounterStore['actions'];
