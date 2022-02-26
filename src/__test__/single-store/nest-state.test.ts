import { act, renderHook } from '@testing-library/react-hooks';
import { it, expect } from 'vitest';
import { create } from '../../create';

const createStore = () => {
  const store = create(
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

  return store;
};

const setUp = (useState: any) =>
  renderHook(() => {
    const { app } = useState();
    const { count } = app;
    return { count };
  });

it('simple nest counter test', () => {
  const [useState, useAction] = createStore();

  const { result } = setUp(useState);
  const action = useAction();

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

it('multi nest count test', () => {
  const [useState, useAction] = createStore();

  const result1 = setUp(useState).result;
  const result2 = setUp(useState).result;
  const result3 = setUp(useState).result;

  const action = useAction();

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
