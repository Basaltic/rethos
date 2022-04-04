import { unstable_batchedUpdates as reactBatchUpdate } from 'react-dom';
import { IStoreQuery } from './store-query';
import { StoreStateUpdateTracker } from './store-state-update-tracker';
import { ExtractActions, IActions, Type } from './types';

/**
 * Actions in Store
 */
export class StoreActionsContainer {
  /**
   * Track the execution of the action
   */
  private actionExecutionStack: Function[] = [];

  constructor(private actionsCollection: Map<any, any>, private query: IStoreQuery, private tracker: StoreStateUpdateTracker) {}

  getActions<A extends IActions>(type: Type): ExtractActions<A> {
    const actions = this.actionsCollection.get(type) as ExtractActions<A>;
    return actions;
  }

  /**
   * Add actions to the containers
   *
   * @param action actions defined by the user
   * @param state the state passed to the action
   * @returns a proxy action object
   */
  addActions<A extends IActions>(type: Type, actions: A) {
    const proxyActions = new Proxy(actions, {
      get: (target: A, prop: string) => {
        const rawAction = target[prop];
        return (...args: any) => {
          try {
            const doAction = () => rawAction(this.query, ...args);

            this.actionExecutionStack.push(doAction);
            doAction();
            this.actionExecutionStack.pop();

            const isExecuting = this.actionExecutionStack.length > 0;
            if (!isExecuting) {
              if (typeof reactBatchUpdate === 'function') {
                reactBatchUpdate(this.tracker.commitUpdate.bind(this.tracker));
              } else {
                this.tracker.commitUpdate();
              }
            }
          } catch (e) {
            console.error(e);
            this.actionExecutionStack = [];
          }
        };
      },
    }) as unknown as ExtractActions<A>;

    this.actionsCollection.set(type, proxyActions);
  }
}
