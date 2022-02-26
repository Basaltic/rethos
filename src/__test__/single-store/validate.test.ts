import { it, expect } from 'vitest';
import { SingleStore } from '../../lib/single-store';

const store = new SingleStore(
  {
    count: 1,
    app: {
      count: 1,
    },
  },
  {
    inc: (s) => {
      s.count += 1;
      s.app.count += 1;
    },
    dec: (s) => {
      s.count -= 1;
      s.app.count -= 1;
    },
  },
);

it('test: throw error if change state outside of action', () => {
  const { app } = store.getState(() => {});

  const changeCount = () => {
    app.count = 10;
  };

  const deleteProp = () => {
    delete app.count;
  };

  expect(() => {
    changeCount();
  }).toThrowError('state value only can be changed in actions');

  expect(() => {
    deleteProp();
  }).toThrowError('state value only can be changed in actions');
});
