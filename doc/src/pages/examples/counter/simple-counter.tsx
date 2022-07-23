import React from 'react';
import { useStoreActions, useStoreState } from '../../../../../src/main';
import { Page } from '../../../containers/page';
import { simpleCounterStoreDescriptor } from './model';

export const SimpleCounterPage = () => {
  const state = useStoreState(simpleCounterStoreDescriptor);
  const actions = useStoreActions(simpleCounterStoreDescriptor);

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
          <button className="btn" onClick={() => actions.dec()}>
            减少
          </button>
        </div>
      </div>
    </Page>
  );
};
