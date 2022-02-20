import { act, renderHook } from '@testing-library/react-hooks';
import { it, expect } from 'vitest';
import { create } from '../../create';

const createStore = () => {
  const store = create(
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

  return store;
};

type TStore = ReturnType<typeof createStore>;

const setUp = (store: TStore) =>
  renderHook(() => {
    const { count } = store.state;
    return { count };
  });

it('simple counter test', () => {
  const store = createStore();

  const { result } = setUp(store);
  const action = store.action;

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

it('multi count subscriber', () => {
  const store = createStore();

  const result1 = setUp(store).result;
  const result2 = setUp(store).result;
  const result3 = setUp(store).result;

  const action = store.action;

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
