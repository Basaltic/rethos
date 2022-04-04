import type { TUpdateFn } from './types';

/**
 * Track All the Proxy State
 */
export class StoreStateUpdateTracker {
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

  /**
   *
   * @param updateFn
   */
  cleanup(updateFn: TUpdateFn) {}

  /**
   * Track Update
   */
  trackUpdate(target: any, propKey: string | symbol, updateFunc: () => void) {
    const isArray = Array.isArray(target);

    if (isArray) {
      let updateSet = this.observableArrayUpdateMap.get(target);
      if (!updateSet) {
        updateSet = new Set();
        this.observableArrayUpdateMap.set(target, updateSet);
      }
      if (!updateSet.has(updateFunc)) {
        updateSet.add(updateFunc);

        let updateFuncSet = this.updateToPropKeySetMap.get(updateFunc);
        if (!updateFuncSet) {
          updateFuncSet = new Set();
          this.updateToPropKeySetMap.set(updateFunc, updateFuncSet);
        }

        updateFuncSet.add(updateSet);
      }
    } else {
      let targetPropUpdateMap = this.observableUpdateMap.get(target);
      if (!targetPropUpdateMap) {
        targetPropUpdateMap = new Map();
        this.observableUpdateMap.set(target, targetPropUpdateMap);
      }

      let updateSet = targetPropUpdateMap.get(propKey);
      if (!updateSet) {
        updateSet = new Set();
        targetPropUpdateMap.set(propKey, updateSet);
      }

      if (!updateSet.has(updateFunc)) {
        updateSet.add(updateFunc);

        let updateFuncSet = this.updateToPropKeySetMap.get(updateFunc);
        if (!updateFuncSet) {
          updateFuncSet = new Set();
          this.updateToPropKeySetMap.set(updateFunc, updateFuncSet);
        }

        updateFuncSet.add(updateSet);
      }
    }
  }

  /**
   * Collect update duration the action executation
   */
  collectUpdate(target: any, propKey: string) {
    const isArray = Array.isArray(target);

    let keyUpdateSet;
    if (isArray) {
      keyUpdateSet = this.observableArrayUpdateMap.get(target);
    } else {
      const targetUpdateStore = this.observableUpdateMap.get(target);

      keyUpdateSet = targetUpdateStore?.get(propKey);
    }

    keyUpdateSet?.forEach((u) => {
      this.updateCollectionSet.add(u);
    });
  }
  /**
   * Actually Commit the State Update After Action
   */
  commitUpdate() {
    if (this.updateCollectionSet.size > 0) {
      this.updateCollectionSet.forEach((update) => {
        update?.();
      });

      this.updateCollectionSet.clear();
    }
  }
}
