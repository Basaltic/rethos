import { act, renderHook } from '@testing-library/react-hooks';
import { it, expect } from 'vitest';
import { createStore } from '../../main';

const createTestStore = () => {
  const store = createStore(
    {
      count: 1,
      app: {
        count: 1,
      },
    },
    {
      inc: s => {
        s.count += 1;
      },
      dec: s => {
        s.count -= 1;
      },
    }
  );
  return store;
};

const setUp = (useState: any, id?: string) => {
  return renderHook(() => {
    const { count } = useState(id);
    return { count };
  });
};

it('test hooks: simple family counter', () => {
  const [useState, getActions] = createTestStore();

  const result = setUp(useState, '1').result;
  const result2 = setUp(useState, '2').result;

  const action = getActions('1');
  const action2 = getActions('2');

  expect(result.current.count).toBe(1);
  expect(result2.current.count).toBe(1);

  act(() => {
    action.inc();
  });
  expect(result.current.count).toBe(2);
  expect(result2.current.count).toBe(1);

  act(() => {
    action.dec();
  });
  expect(result.current.count).toBe(1);
  expect(result2.current.count).toBe(1);

  act(() => {
    action.inc();
    action.inc();

    action2.inc();
  });
  expect(result.current.count).toBe(3);
  expect(result2.current.count).toBe(2);
});
