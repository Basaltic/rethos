import { TState, TAction, SingleStore } from './lib/single-store';

/**
 * Create A Store
 *
 * @param {Object} state a object represent the state, MUST BE A OBJECT!!
 * @param {TAction} action a collection of action that change the state in the store
 * @returns
 */
export function create<S extends TState, A extends TAction<S>>(state: S, action: A) {
  const singleStore = new SingleStore(state, action);

  return {
    state: singleStore.getState(),
    action: singleStore.getAction() as unknown as Record<keyof A, () => void>,
  };
}
