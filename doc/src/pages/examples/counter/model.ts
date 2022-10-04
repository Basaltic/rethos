import { entity } from '../../../../../src/main';
import { storeContainer } from '../../../store';

// - 这个类型定义，可以认为是定义了原型（也就是数据结构）

export interface ISimpleCounterState {
  count: number;
  test: string;
}

const defaultState: ISimpleCounterState = {
  count: 10,
  test: '',
};

// 这里可以认为是创建了 entity

export const simpleCounterStoreDescriptor = entity({
  name: 'counter',
  state: defaultState,
  processors: {
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

storeContainer.register(simpleCounterStoreDescriptor);

// export const ISimpleCounterStoreType = simpleCounterStoreDescriptor.type;
// export type ISimpleCounterStoreDescriptor = typeof simpleCounterStoreDescriptor;
// export type ISimpleCounterStoreState = ISimpleCounterStoreDescriptor['state'];
// export type ISimpleCounterStoreActions = ISimpleCounterStoreDescriptor['actions'];
