import type { IStoreQuery } from './store-query';

type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never;

export type Id = string | number | symbol;
export type Type = any;
export type Primitive = bigint | boolean | null | number | string | symbol | undefined;
export type StateValue = Primitive | IState | StateValueArray;

export interface StateValueArray extends Array<StateValue> {}

export interface IState {
  [key: string]: StateValue;
}

export interface IActions {
  [key: string]: (query: IStoreQuery, ...args: any) => void;
}

export type ExtractActions<A extends IActions> = {
  [key in keyof A]: (...rest: DropFirst<Parameters<A[key]>>) => void;
};

export type TUpdateFn = () => void;
