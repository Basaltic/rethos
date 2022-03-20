type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never;

export type StoreId = string | number | symbol;

export type TState = Record<string, any>;
export type TAction<S> = { [key: string]: (s: S, ...args: any) => any };
export type TProxyAction = { [key: string]: () => void };

export type ExtractAction<A extends TAction<any>> = {
  [key in keyof A]: (...rest: DropFirst<Parameters<A[key]>>) => void;
};
