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
  return store;
};

const setUp = (useState: any, useAction) => {
  return renderHook(() => {
    const { count } = useState();
    const action = useAction();
    return { count, action };
  });
};

it('test hooks: simple counter', () => {
  const [useState, useAction] = createTestStore();
  const { result } = setUp(useState, useAction);

  const action = result.current.action;

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
  const [useState, useAction] = createTestStore();

  const result1 = setUp(useState, useAction).result;
  const result2 = setUp(useState, useAction).result;
  const result3 = setUp(useState, useAction).result;

  const action = result1.current.action;

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
