import React from 'react';
import { useEntity } from '../../../../../src/main';
import { Page } from '../../../containers/page';
import { simpleCounterStoreDescriptor } from './model';

export const SimpleCounterPage = () => {
  const [state, processors] = useEntity(simpleCounterStoreDescriptor);

  const { count } = state;

  console.log(count);

  return (
    <Page>
      <div>
        <div className="text-xl">当前数值: {count}</div>
        <br />
        <div className="flex gap-2">
          <button className="btn" onClick={() => processors.inc()}>
            增加
          </button>
          <button className="btn" onClick={() => processors.dec()}>
            减少
          </button>
        </div>
      </div>
    </Page>
  );
};
