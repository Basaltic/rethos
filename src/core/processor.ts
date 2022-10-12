/**
 * Processor is a logic unit which is used to change the states of mulitple store isntances
 */

import { unstable_batchedUpdates as reactBatchUpdate } from 'react-dom';
import { IRawState } from './observable-state';
import { MutableQuery } from './query';
import { StoreStateUpdateTracker } from './state-update-tracker';
import { DropFirst } from './types';

/**
 * Processor is a pure function with a query instance & custom argument
 */
export type Processor = (query: MutableQuery, ...args: any) => void;

export type Processors = {
  [key: string]: Processor;
};

export type ExtractProcessors<A extends Processors> = {
  [key in keyof A]: (...rest: DropFirst<Parameters<A[key]>>) => void;
};

export type EntityProcessor<S extends IRawState = IRawState> = (state: S, ...args: any) => void;

export type EntityProcessors<S extends IRawState = IRawState> = {
  [key: string]: EntityProcessor<S>;
};

export type ExtractEntityProcessors<A extends EntityProcessors> = {
  [key in keyof A]: (...rest: DropFirst<Parameters<A[key]>>) => void;
};

export type ExtractProcessor<A extends Processor | EntityProcessor> = (...rest: DropFirst<Parameters<A>>) => void;

/**
 * Proxy the action functions
 *
 * @param action actions defined by the user
 * @param state the state passed to the action
 * @returns a proxy action object
 */
export function createProxyEntityProcessors<A extends EntityProcessors>(
  processors: A,
  state: IRawState,
  tracker: StoreStateUpdateTracker,
  executionStack: any[],
) {
  const proxyProcessors = new Proxy(processors, {
    get: (target: A, prop: string) => {
      const rawProcessors = target[prop];
      return (...args: any) => {
        try {
          const doAction = () => rawProcessors(state, ...args);

          executionStack.push(doAction);
          doAction();
          executionStack.pop();

          const isExecuting = executionStack.length > 0;
          if (!isExecuting) {
            if (typeof reactBatchUpdate === 'function') {
              reactBatchUpdate(tracker.commitUpdate.bind(tracker));
            } else {
              tracker.commitUpdate();
            }
          }
        } catch (e) {
          executionStack = [];
        }
      };
    },
  }) as unknown as ExtractEntityProcessors<A>;

  return proxyProcessors;
}

export function createProxyProcessors<A extends Processors>(
  processors: A,
  query: MutableQuery,
  tracker: StoreStateUpdateTracker,
  executionStack: any[],
) {
  const proxyProcessors = new Proxy(processors, {
    get: (target: A, prop: string) => {
      const rawProcessors = target[prop];
      return (...args: any) => {
        try {
          const doAction = () => rawProcessors(query, ...args);

          executionStack.push(doAction);
          doAction();
          executionStack.pop();

          const isExecuting = executionStack.length > 0;
          if (!isExecuting) {
            if (typeof reactBatchUpdate === 'function') {
              reactBatchUpdate(tracker.commitUpdate.bind(tracker));
            } else {
              tracker.commitUpdate();
            }
          }
        } catch (e) {
          executionStack = [];
        }
      };
    },
  }) as unknown as ExtractProcessors<A>;

  return proxyProcessors;
}
