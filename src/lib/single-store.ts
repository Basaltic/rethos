import { unstable_batchedUpdates as reactBatchUpdate } from 'react-dom';
import { isObject } from '../utils/is-object';

export type TState = Record<string, any>;
export type TAction<S> = { [key: string]: (s: S) => void };
export type TProxyAction = { [key: string]: () => void };

/**
 * Single Store to mange the state and action
 */
export class SingleStore<S extends TState> {
  private originalState: any;
  private originalAction: TAction<S>;

  private proxyAction!: TProxyAction;

  private observableStore = new WeakMap<any, Map<any, Set<any>>>();

  /**
   * collect the "update func" in an action
   */
  private updateCollectionSet = new Set<any>();

  constructor(state: S, action: TAction<S>) {
    this.originalState = state;
    this.originalAction = action;

    this.observableStore.set(state, new Map());
  }

  public getState(updateFunc?: () => void) {
    return this.createProxyState(this.originalState, updateFunc);
  }

  public getAction() {
    if (!this.proxyAction) {
      const proxyState = this.createProxyStateInAction(this.originalState);
      this.proxyAction = this.createProxyAction(this.originalAction, proxyState);
    }

    return this.proxyAction;
  }

  /**
   * Proxy the Original State Which only used in action as input params
   *
   * @param state
   * @returns
   */
  private createProxyStateInAction(state: S): S {
    return new Proxy(state, {
      get: (target: S, propKey: string) => {
        const value = Reflect.get(target, propKey);
        if (isObject(value)) {
          return this.createProxyStateInAction(value) as any;
        }
        return value;
      },
      set: (target: S, propKey: string, value: any) => {
        // change the original value
        // the set op will immediately get the latest change
        Reflect.set(target, propKey, value);

        // collect the update
        const targetUpdateStore = this.observableStore.get(target);
        let keyUpdateSet = targetUpdateStore?.get(propKey);

        keyUpdateSet?.forEach((u) => {
          this.updateCollectionSet.add(u);
        });

        return true;
      },
    });
  }

  /**
   * Proxy the Original State which is used in components
   *  - auto make state observable
   *  - auto collect state update in  action
   */
  private createProxyState(state: S, updateFunc?: () => void): S {
    return new Proxy(state, {
      get: (target: S, propKey: string) => {
        const value = Reflect.get(target, propKey);

        if (updateFunc) {
          let targetUpdateStore = this.observableStore.get(target);
          if (!targetUpdateStore) {
            targetUpdateStore = new Map();
            this.observableStore.set(target, targetUpdateStore);
          }

          let keyUpdateSet = targetUpdateStore?.get(propKey);
          if (!keyUpdateSet) {
            keyUpdateSet = new Set();
            targetUpdateStore?.set(propKey, keyUpdateSet);
          }

          if (!keyUpdateSet.has(updateFunc)) {
            keyUpdateSet.add(updateFunc);
          }
        }

        if (isObject(value)) {
          return this.createProxyState(value, updateFunc) as any;
        }

        return value;
      },
      set: () => {
        throw new Error('state value only can be changed in actions');
      },
      deleteProperty: () => {
        throw new Error('state value only can be changed in actions');
      },
    }) as S;
  }

  /**
   * Proxy the action functions
   *
   * @param action actions defined by the user
   * @param state the state passed to the action
   * @returns a proxy action object
   */
  private createProxyAction(action: TAction<S>, state: S): TProxyAction {
    return new Proxy(action, {
      get: (target: TAction<S>, prop: string) => {
        const action = target[prop];
        return () => {
          try {
            action(state);

            if (typeof reactBatchUpdate === 'function') {
              reactBatchUpdate(this.commitActionUpdate.bind(this));
            } else {
              this.commitActionUpdate();
            }
          } catch (e) {}
        };
      },
    }) as TProxyAction;
  }

  /**
   * Actually Commit the State Update After Action
   */
  private commitActionUpdate() {
    if (this.updateCollectionSet.size > 0) {
      this.updateCollectionSet.forEach((update) => {
        update?.();
      });

      this.updateCollectionSet.clear();
    }
  }
}
