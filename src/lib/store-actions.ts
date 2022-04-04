import { unstable_batchedUpdates as reactBatchUpdate } from 'react-dom';
import { StoreQuery } from './store-query';
import { StoreStateUpdateTracker } from './store-state-update-tracker';
import { ExtractActions, IActions } from './types';

/**
 * Actions in Store
 */
export class StoreActions {
  /**
   * Proxy the action functions
   *
   * @param action actions defined by the user
   * @param state the state passed to the action
   * @returns a proxy action object
   */
  static createProxyAction<A extends IActions>(action: A, query: StoreQuery, tracker: StoreStateUpdateTracker) {
    return new Proxy(action, {
      get: (target: A, prop: string) => {
        const rawAction = target[prop];
        return (...args: any) => {
          try {
            const doAction = () => rawAction(query, ...args);

            // this.actionExecutionStack.push(doAction);
            doAction();
            // this.actionExecutionStack.pop();

            // const isExecuting = this.actionExecutionStack.length > 0;
            // if (!isExecuting) {
            if (typeof reactBatchUpdate === 'function') {
              reactBatchUpdate(tracker.commitUpdate.bind(tracker));
            } else {
              tracker.commitUpdate();
            }
            // }
          } catch (e) {
            console.error(e);
            // this.actionExecutionStack = [];
          }
        };
      },
    }) as unknown as ExtractActions<A>;
  }
}
