import { unstable_batchedUpdates as reactBatchUpdate } from 'react-dom';
import { IStoreState } from './store-state';
import { StoreStateUpdateTracker } from './store-state-update-tracker';
import type { DropFirst } from './types';

export interface IStoreActions<S extends IStoreState = IStoreState> {
  [key: string]: (state: S, ...args: any) => void;
}

export type ExtractActions<A extends IStoreActions> = {
  [key in keyof A]: (...rest: DropFirst<Parameters<A[key]>>) => void;
};
/**
 * Proxy the action functions
 *
 * @param action actions defined by the user
 * @param state the state passed to the action
 * @returns a proxy action object
 */
export function createProxyAction<A extends IStoreActions>(
  actions: A,
  state: IStoreState,
  tracker: StoreStateUpdateTracker,
  actionExecutionStack: any[],
) {
  const proxyActions = new Proxy(actions, {
    get: (target: A, prop: string) => {
      const rawAction = target[prop];
      return (...args: any) => {
        try {
          const doAction = () => rawAction(state, ...args);

          actionExecutionStack.push(doAction);
          doAction();
          actionExecutionStack.pop();

          const isExecuting = actionExecutionStack.length > 0;
          if (!isExecuting) {
            if (typeof reactBatchUpdate === 'function') {
              reactBatchUpdate(tracker.commitUpdate.bind(tracker));
            } else {
              tracker.commitUpdate();
            }
          }
        } catch (e) {
          console.log(e);
          actionExecutionStack = [];
        }
      };
    },
  }) as unknown as ExtractActions<A>;

  return proxyActions;
}
