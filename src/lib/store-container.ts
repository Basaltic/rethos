import { Store } from "./store";
import { ExtractActions, IStoreActions } from "./store-actions";
import { IStoreDescriptor } from "./store-descriptor";
import { IStoreRegistry, StoreRegistry } from "./store-registry";
import { IStoreState } from "./store-state";
import { StoreStateUpdateTracker } from "./store-state-update-tracker";
import { Identifier, StoreType } from "./types";

export interface IStoreContainer {

  /**
   * Add New Store Descriptor
   * 
   * @param discriptor 
   */
  add(discriptor: IStoreDescriptor): void


  /**
   * Bind Type 
   * 
   * @param type 
   */
  bind(type: StoreType): StateBinder


  /**
   * Get Store Instance
   * 
   * @param type 
   * @param id 
   */
  get(type: StoreType, id: Identifier): Store;

  /**
   * Get State 
   * 
   * @param type 
   * @param id 
   */
  getState<S extends IStoreState>(type: StoreType, id: Identifier): S;

  /**
   * Get Actions
   * 
   * @param type 
   * @param id 
   */
  getActions<A extends IStoreActions>(type: StoreType, id: Identifier): ExtractActions<A>;

  /**
   * Dispose 
   * 
   * @param type 
   * @param id 
   */
  dispose(type: StoreType, id: Identifier): void;
}


interface IStateBinder {
  /**
   * Bind State to the Store
   */
  toState<S extends IStoreState>(state: S): IActionsBinder
}

interface IActionsBinder {
  /**
   * 
   */
  toActions<A extends IStoreActions>(actions: A): IActionsBinder;
}



export class StateBinder implements IStateBinder {

  

  constructor(private registry: IStoreRegistry, private type: StoreType) {}

  toState<S extends IStoreState>(state: S): IActionsBinder {
    throw new Error("Method not implemented.");
  }

}

export class ActionsBinder implements IActionsBinder {
  constructor(private registry: IStoreRegistry, private type: StoreType) {}

  toActions<A extends IStoreActions>(actions: A): IActionsBinder {
    throw new Error("Method not implemented.");
  }

}





export class StoreContainer implements IStoreContainer {

  private registry: IStoreRegistry;
  /**
   * Track the execution of the action
   */
  private executionStack: Function[];
  private updateTracker: StoreStateUpdateTracker;

  constructor() {
    this.registry = new StoreRegistry();

  }

  add(discriptor: IStoreDescriptor): void {
    throw new Error("Method not implemented.");
  }


  bind(type: StoreType): StateBinder {
    throw new Error("Method not implemented.");
  }

  get(type: any, id: Identifier): Store {
    throw new Error("Method not implemented.");
  }
  getState<S extends IStoreState>(type: any, id: Identifier): S {
    throw new Error("Method not implemented.");
  }
  getActions<A extends IStoreActions>(type: any, id: Identifier): ExtractActions<A> {
    throw new Error("Method not implemented.");
  }
  dispose(type: any, id: Identifier): void {
    throw new Error("Method not implemented.");
  }


}


