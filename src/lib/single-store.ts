import { unstable_batchedUpdates as reactBatchUpdate } from 'react-dom';
import { isObject } from '../utils/is-object';

export type TState = Record<string, any>;
export type TAction<S> = { [key: string]: (s: S) => void };

type ActionUpdateCollection = Record<string, any>;

/**
 * Single Store
 */
export class SingleStore<S extends TState> {
  private actionUpdateCollection: ActionUpdateCollection = {};

  private updateCollectionSet = new Set<any>();

  private originalState: any;
  private originalAction: TAction<S>;

  private proxyState: S;
  private proxyAction: TAction<S>;

  private updateStore = new WeakMap<any, Map<any, Set<any>>>();

  /**
   * Check if action is running
   */
  private isInAction: boolean = false;

  constructor(state: S, action: TAction<S>) {
    this.originalState = state;
    this.originalAction = action;

    this.proxyState = this.createProxyStateInAction(state);
    this.proxyAction = this.createProxyAction(action);

    this.updateStore.set(state, new Map());
  }

  public getState(updateFunc: () => void) {
    return this.createProxyState(this.originalState, updateFunc);
  }

  public getAction() {
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
        this.actionUpdateCollection[propKey] = value;

        const targetUpdateStore = this.updateStore.get(target);
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
  private createProxyState(state: S, updateFunc: () => void): S {
    return new Proxy(state, {
      get: (target: S, propKey: string) => {
        const value = Reflect.get(target, propKey);

        let targetUpdateStore = this.updateStore.get(target);
        if (!targetUpdateStore) {
          targetUpdateStore = new Map();
          this.updateStore.set(target, targetUpdateStore);
        }

        let keyUpdateSet = targetUpdateStore?.get(propKey);
        if (!keyUpdateSet) {
          keyUpdateSet = new Set();
          targetUpdateStore?.set(propKey, keyUpdateSet);
        }

        if (!keyUpdateSet.has(updateFunc)) {
          keyUpdateSet.add(updateFunc);
        }

        if (isObject(value)) {
          return this.createProxyState(value, updateFunc) as any;
        }

        return value;
      },
      set: () => {
        throw new Error('state value only can be changed in actions');
      },
    }) as S;
  }

  /**
   * Proxy the action functions
   */
  private createProxyAction(action: TAction<S>) {
    return new Proxy(action, {
      get: (target: TAction<S>, prop: string) => {
        const action = target[prop];

        return () => {
          this.isInAction = true;
          try {
            action(this.proxyState);

            if (typeof reactBatchUpdate === 'function') {
              reactBatchUpdate(this.commitActionUpdate.bind(this));
            } else {
              this.commitActionUpdate();
            }
          } catch (e) {}
          this.isInAction = false;
        };
      },
    });
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
