export type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never;

export type Identifier = string | number | symbol;
export type StoreType = any;

export type TUpdateFn = () => void;
