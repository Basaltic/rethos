import { unstable_batchedUpdates as reactBatchUpdate } from 'react-dom';
import { isObject } from '../utils/is-object';

type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never;

export type TState = Record<string, any>;
export type TAction<S> = { [key: string]: (s: S, ...args: any) => any };
export type TProxyAction = { [key: string]: () => void };

export type ExtractAction<A extends TAction<any>> = {
  [key in keyof A]: (...rest: DropFirst<Parameters<A[key]>>) => void;
};

/**
 * Extra Configs of the single store
 */
export interface ISingleStoreConfigs {
  /**
   * Id of the instance
   */
  id?: any;
  /**
   * Name of the Store
   */
  name?: string;
}

/**
 * Single Store to mange the state and action
 */
export class SingleStore<S extends TState, A extends TAction<S>> {
  configs?: ISingleStoreConfigs;

  /**
   * The original(default) state object.
   * - This object mainly used as the "identifier"
   * - NEVER change the value in any proxy
   */
  originalState: any;
  originalAction?: A;

  proxyAction!: TProxyAction;

  /**
   * state -> propKey -> <update func> set
   */
  observableUpdateMap = new WeakMap<any, Map<any, Set<any>>>();

  /**
   * update func -> set of prop key set
   */
  updateToPropKeySetMap = new WeakMap<any, Set<any>>();

  /**
   * update func -> obj -> proxy
   */
  rawToProxyMap = new WeakMap<any, WeakMap<any, any>>();

  /**
   * collect the "update func" in an action
   */
  updateCollectionSet = new Set<any>();

  constructor(state: S, action: A, configs?: ISingleStoreConfigs) {
    this.configs = configs;

    this.originalState = state;
    this.originalAction = action;

    this.observableUpdateMap.set(state, new Map());
  }

  /**
   * Get State
   *
   * @param updateFunc Called when the subscribed prop value changed; also it can be considered as identifier
   * @returns
   */
  getState(updateFunc: () => void) {
    const proxyState = this.getProxyState(this.originalState, updateFunc);
    return proxyState;
  }

  /**
   * Get Actions
   */
  getAction() {
    if (this.originalAction) {
      if (!this.proxyAction) {
        const proxyState = this.createProxyStateInAction(this.originalState);
        this.proxyAction = this.createProxyAction(this.originalAction, proxyState);
      }
    }

    return this.proxyAction as ExtractAction<A>;
  }

  /**
   * Clean the unused subscribed function
   *
   * @param updateFunc func subscribted to the state
   */
  cleanUpdate(updateFunc: () => void) {
    const updateFuncSet = this.updateToPropKeySetMap.get(updateFunc);
    updateFuncSet?.forEach((set: Set<any>) => {
      set.delete(updateFunc);
    });
    this.updateToPropKeySetMap.delete(updateFunc);
    this.rawToProxyMap.delete(updateFunc);
  }

  /**
   * Get Proxy State
   *
   * @param state
   * @param updateFunc
   * @returns
   */
  private getProxyState(state: S, updateFunc?: () => void) {
    let rawToProxyMap = this.rawToProxyMap.get(updateFunc);
    if (!rawToProxyMap) {
      rawToProxyMap = new WeakMap();
      this.rawToProxyMap.set(updateFunc, rawToProxyMap);
    }

    let proxyState = rawToProxyMap.get(state);
    if (!proxyState) {
      proxyState = this.createProxyState(state, updateFunc);
      rawToProxyMap.set(state, proxyState);
    }
    return proxyState;
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
        // only change the actual state internally
        Reflect.set(target, propKey, value);

        // collect the update
        this.collectUpdate(target, propKey);

        return true;
      },
      deleteProperty: (target: S, propKey: string) => {
        const result = Reflect.deleteProperty(target, propKey);

        this.collectUpdate(target, propKey);

        return result;
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
        const originalValue = Reflect.get(target, propKey);

        if (updateFunc) {
          let targetPropUpdateMap = this.observableUpdateMap.get(target);
          if (!targetPropUpdateMap) {
            targetPropUpdateMap = new Map();
            this.observableUpdateMap.set(target, targetPropUpdateMap);
          }

          let propKeyUpdateSet = targetPropUpdateMap.get(propKey);
          if (!propKeyUpdateSet) {
            propKeyUpdateSet = new Set();
            targetPropUpdateMap.set(propKey, propKeyUpdateSet);
          }

          if (!propKeyUpdateSet.has(updateFunc)) {
            propKeyUpdateSet.add(updateFunc);

            let updateFuncSet = this.updateToPropKeySetMap.get(updateFunc);
            if (!updateFuncSet) {
              updateFuncSet = new Set();
              this.updateToPropKeySetMap.set(updateFunc, updateFuncSet);
            }

            updateFuncSet.add(propKeyUpdateSet);
          }
        }

        if (isObject(originalValue)) {
          return this.createProxyState(originalValue, updateFunc) as any;
        }

        return originalValue;
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
        return (...args: any) => {
          try {
            action(state, ...args);

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
      this.updateCollectionSet.forEach(update => {
        update?.();
      });

      this.updateCollectionSet.clear();
    }
  }

  /**
   * Collect Update
   */
  private collectUpdate(target: any, propKey: string) {
    const targetUpdateStore = this.observableUpdateMap.get(target);
    const keyUpdateSet = targetUpdateStore?.get(propKey);

    keyUpdateSet?.forEach(u => {
      this.updateCollectionSet.add(u);
    });
  }
}
