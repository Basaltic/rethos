export type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never;

export type Identifier = string | number | symbol;
export type StoreType = symbol;

export type TUpdateFn = () => void;

export type JSONValue = string | number | boolean | null | bigint | { [x: string]: JSONValue } | Array<JSONValue>;
