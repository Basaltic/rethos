/**
 * Processor is a logic unit which is used to change the states of mulitple store isntances
 */

import { unstable_batchedUpdates as reactBatchUpdate } from 'react-dom';
import { Container } from './container';
import { IRawState } from './observable-state';
import { StoreStateUpdateTracker } from './state-update-tracker';
import type { DropFirst } from './types';

export type IEntityProcessors<S extends IRawState = IRawState> = {
  [key: string]: (state: S, ...args: any) => void;
};

export type ExtractEntityProcessor<A extends IEntityProcessors> = {
  [key in keyof A]: (...rest: DropFirst<Parameters<A[key]>>) => void;
};

/**
 * Proxy the action functions
 *
 * @param action actions defined by the user
 * @param state the state passed to the action
 * @returns a proxy action object
 */
export function createProxyEntityProcessor<A extends IEntityProcessors>(
  actions: A,
  state: IRawState,
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
          actionExecutionStack = [];
        }
      };
    },
  }) as unknown as ExtractEntityProcessor<A>;

  return proxyActions;
}

/**
 *
 */
export interface IProcessor {
  execute(c: Container): void;
}

class Test implements IProcessor {
  execute(c: Container): void {
    console.log('xxxx');
  }
}

class Tes2 {}

function t<T extends IProcessor>(p: new () => T) {}
