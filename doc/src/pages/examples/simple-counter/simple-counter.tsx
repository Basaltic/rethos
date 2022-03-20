import React from 'react';
import { createStore } from '../../../../../src/create';
import { Page } from '../../../containers/page';

const counterStore = createStore({ count: 0 }, { inc: (s) => (s.count += 1), des: (s) => (s.count -= 1) });

export const SimpleCounterPage = () => {
  const state = counterStore.useState();
  const actions = counterStore.getActions();

  const { count } = state;

  return (
    <Page>
      <div>
        <div className="text-xl">当前数值: {count}</div>
        <br />
        <div className="flex gap-2">
          <button className="btn" onClick={() => actions.inc()}>
            增加
          </button>
          <button className="btn" onClick={() => actions.des()}>
            减少
          </button>
        </div>
      </div>
    </Page>
  );
};
