import { useState, Dispatch, SetStateAction, useMemo, useEffect } from 'react';
import { unstable_batchedUpdates as reactBatchUpdate } from 'react-dom';

export type TState = Record<string, any>;
export type TAction<S> = Record<string, (s: S) => void>;

type StateSetters<T> = { [key in keyof T]: Set<Dispatch<SetStateAction<T[keyof T]>>> };
type ObservableState<T> = { [key in keyof T]: () => T[key] };

type ActionUpdateCollection = Record<string, any>;

/**
 * Single Store
 */
export class SingleStore<S extends TState, A extends TAction<S>> {
  /**
   * Cache The Listeners
   */
  private stateSetters = {} as StateSetters<S>;

  private observableStateHooks = {} as ObservableState<S>;

  private actionUpdateCollection: ActionUpdateCollection = {};

  private originalState: any;
  private originalAction: A;

  private proxyState: S;
  private proxyAction: A;

  /**
   * State Only Can be changed in action
   */
  private isInAction: boolean = false;

  constructor(state: S, action: A) {
    this.originalState = state;
    this.originalAction = action;

    this.proxyState = this.setupState();
    this.proxyAction = this.setupAction();
  }

  public getState() {
    return this.proxyState;
  }

  public getAction() {
    return this.proxyAction;
  }

  /**
   * Proxy the Original State
   *  - auto make state first level kv observable use react hook
   *  - auto collect state update in setter in an action
   */
  private setupState() {
    return new Proxy(this.originalState, {
      get: (_: S, prop: string) => {
        try {
          if (!this.isInAction) {
            const useObservableStateHook = this.getObservableStateHook(prop);
            return useObservableStateHook();
          }
        } catch (e) {}

        return this.originalState[prop];
      },
      set: (_: S, prop: string, value: any) => {
        if (!this.isInAction) {
          throw new Error('state value only can be changed in actions');
        } else {
          // 原始的值会随着变化而变化，这是为了在同步的action中，如果多次改变同一个key的值，可以感知到前面的变化
          this.originalState[prop] = value;

          this.actionUpdateCollection[prop] = value;

          return true;
        }
      },
    });
  }

  /**
   * Proxy the action functions
   */
  private setupAction() {
    return new Proxy(this.originalAction, {
      get: (target: A, prop: string) => {
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
    const keys = Object.keys(this.actionUpdateCollection);
    for (const key of keys) {
      const value = this.actionUpdateCollection[key];
      const setters = this.getStateSetters(key);
      for (const set of setters) {
        set(value);
      }
    }

    this.actionUpdateCollection = {};
  }

  private getStateSetters(key: keyof S) {
    let listeners = this.stateSetters[key];

    if (!listeners) {
      listeners = new Set();
      this.stateSetters[key] = listeners;
    }

    return listeners;
  }

  private getObservableStateHook = (key: string) => {
    const listeners = this.getStateSetters(key);

    let hook = this.observableStateHooks[key];

    if (!hook) {
      hook = () => {
        const [value, setValue] = useState(this.originalState[key]);
        useMemo(() => listeners.add(setValue), []);
        useEffect(() => () => listeners.delete(setValue) as unknown as void, []);
        return value;
      };
    }

    return hook;
  };
}
