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
export type ISimpleCounterStoreState = typeof simpleCounterStoreDescriptor['state'];
export type ISimpleCounterStoreActions = typeof simpleCounterStoreDescriptor['actions'];
