import { it, expect } from 'vitest';
import { IMiddleware } from '../../lib/middleware';
import { SingleStore, TState } from '../../lib/single-store';

class ConsoleMiddle1 implements IMiddleware {
  beforeAction(s: TState): void {
    console.log('before1');
  }

  afterAction(s: TState): void {
    console.log('after1');
  }
}

class ConsoleMiddle2 implements IMiddleware {
  beforeAction(s: TState): void {
    console.log('before2');
  }

  afterAction(s: TState): void {
    console.log('after2');
  }
}

const createStore = () => {
  const store = new SingleStore(
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
    {
      // middlewares: [new ConsoleMiddle1(), new ConsoleMiddle2()],
    },
  );

  return store;
};

it('simple counter test', () => {
  // const store = createStore();
  // const uf1 = () => {};
  // const state = store.getState(uf1);
  // const action = store.getAction();
  // expect(state.count).toBe(1);
  // action.inc();
  // expect(state.count).toBe(2);
  // action.dec();
  // expect(state.count).toBe(1);
  // action.inc();
  // action.inc();
  // expect(state.count).toBe(3);
});
