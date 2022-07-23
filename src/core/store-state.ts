import { isObject } from '../utils/is-object';
import { errors, throwError } from './error';
import { StoreStateUpdateTracker } from './store-state-update-tracker';
import { JSONValue } from './types';

export type IStoreState<T extends object = object> = {
  [k in keyof T]: JSONValue;
};

/**
 * Single Store to mange the state and action
 */
export class StoreState<S extends IStoreState> {
  /**
   * The original(default) state object.
   * - This object mainly used as the "identifier"
   * - NEVER change the value in any proxy
   */
  originalState: any;

  /**
   * state -> propKey -> <update func> set
   */
  observableUpdateMap = new WeakMap<any, Map<any, Set<any>>>();

  /**
   * array -> <update func> set
   */
  observableArrayUpdateMap = new WeakMap<any, Set<any>>();

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

  constructor(state: S, private tracker: StoreStateUpdateTracker) {
    this.originalState = state;
    this.observableUpdateMap.set(state, new Map());
  }

  /**
   * Get Subscribable State
   *
   * @param updateFunc Called when the subscribed prop value changed; also it can be considered as identifier
   * @returns
   */
  getSubscribableState(updateFunc?: () => void) {
    const proxyState = this.getInnerSubscribableState(this.originalState, updateFunc);
    return proxyState;
  }

  /**
   * Get State that can be changed in action
   */
  getChangeableState() {
    const proxyState = this.createChangeableState(this.originalState);
    return proxyState;
  }

  /**
   * Get State that is readonly, throw error if it is changed
   */
  getReadonlyState() {
    return this.createReadonlyState(this.originalState);
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
  private getInnerSubscribableState(state: S, updateFunc?: () => void) {
    let rawToProxyMap = this.rawToProxyMap.get(updateFunc);
    if (!rawToProxyMap) {
      rawToProxyMap = new WeakMap();
      this.rawToProxyMap.set(updateFunc, rawToProxyMap);
    }

    let proxyState = rawToProxyMap.get(state);
    if (!proxyState) {
      proxyState = this.createSubscribableState(state, updateFunc);
      rawToProxyMap.set(state, proxyState);
    }
    return proxyState;
  }

  /**
   * Proxy the Original State which is used in components
   *  - auto make state observable
   *  - auto collect state update in  action
   */
  private createSubscribableState(state: S, updateFunc?: () => void): S {
    return new Proxy(state, {
      get: (target: S, propKey: any, receiver) => {
        const isArray = Array.isArray(target);

        if (updateFunc) {
          this.tracker.trackUpdate(target, propKey, updateFunc);
        }

        // TODO: add
        if (isArray) {
          return target[propKey];
        }

        const originalValue = Reflect.get(target, propKey, receiver);
        if (isObject(originalValue)) {
          return this.createSubscribableState(originalValue, updateFunc) as any;
        }

        return originalValue;
      },
      set: () => {
        throw new Error(errors[1]);
      },
      defineProperty: () => {
        throw new Error(errors[1]);
      },
      deleteProperty: () => {
        throw new Error(errors[1]);
      },
    }) as S;
  }

  /**
   * Proxy the Original State Which only used in action as input params
   *
   * @param state
   * @returns
   */
  private createChangeableState(state: S): S {
    return new Proxy(state, {
      get: (target: S, propKey: any, receiver) => {
        const value = Reflect.get(target, propKey, receiver);

        const isArray = Array.isArray(target);

        if (isArray) {
          return target[propKey];
        }

        if (isObject(value)) {
          return this.createChangeableState(value) as any;
        }

        return value;
      },
      set: (target: S, propKey: any, value: any) => {
        const oldValue = Reflect.get(target, propKey);

        if (oldValue !== value) {
          Reflect.set(target, propKey, value);

          // collect the update
          this.tracker.collectUpdate(target, propKey);
        }

        return true;
      },
      deleteProperty: (target: S, propKey: string) => {
        const result = Reflect.deleteProperty(target, propKey);

        this.tracker.collectUpdate(target, propKey);

        return result;
      },
    });
  }

  /**
   * Create a readonly state
   *
   * @param state
   * @returns
   */
  private createReadonlyState(state: S): S {
    return new Proxy(state, {
      get: (target: S, propKey: any, receiver) => {
        const value = Reflect.get(target, propKey, receiver);

        const isArray = Array.isArray(target);

        if (isArray) {
          return target[propKey];
        }

        if (isObject(value)) {
          return this.createReadonlyState(value) as any;
        }

        return value;
      },
      set: () => {
        throwError(1);
        return true;
      },
      deleteProperty: () => {
        throwError(1);
        return true;
      },
    });
  }
}
