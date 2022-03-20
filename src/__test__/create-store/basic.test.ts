import { act, renderHook } from '@testing-library/react-hooks';
import { it, expect } from 'vitest';
import { createStore } from '../../main';

const createTestStore = () => {
  const store = createStore(
    {
      count: 1,
    },
    {
      inc: (s) => {
        s.count += 1;
      },
      dec: (s) => {
        s.count -= 1;
      },
    },
  );

  store.getActions();

  return store;
};

const setUp = (useState: any) => {
  return renderHook(() => {
    const { count } = useState();
    return { count };
  });
};

it('test hooks: simple counter', () => {
  const store = createTestStore();
  const { result } = setUp(store.useState);

  const action = store.getActions();

  expect(result.current.count).toBe(1);

  act(() => {
    action.inc();
  });

  expect(result.current.count).toBe(2);
  act(() => {
    action.dec();
  });
  expect(result.current.count).toBe(1);
  act(() => {
    action.inc();
    action.inc();
  });
  expect(result.current.count).toBe(3);
});

it('test hooks: multi count test', () => {
  const store = createTestStore();

  const result1 = setUp(store.useState).result;
  const result2 = setUp(store.useState).result;
  const result3 = setUp(store.useState).result;

  const action = store.getActions();

  expect(result1.current.count).toBe(1);
  expect(result2.current.count).toBe(1);
  expect(result3.current.count).toBe(1);
  act(() => {
    action.inc();
  });

  expect(result1.current.count).toBe(2);
  expect(result2.current.count).toBe(2);
  expect(result3.current.count).toBe(2);

  act(() => {
    action.dec();
  });

  expect(result1.current.count).toBe(1);
  expect(result2.current.count).toBe(1);
  expect(result3.current.count).toBe(1);
});
