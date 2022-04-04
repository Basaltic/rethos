import React from 'react';
import { useStoreActions, useSubscribableState } from '../../../../../src/main';
import { Page } from '../../../containers/page';
import { ICounterActions, ICounterState } from './model';

export const SimpleCounterPage = () => {
  const state = useSubscribableState<ICounterState>(ICounterState);
  const actions = useStoreActions<ICounterActions>(ICounterActions);

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
