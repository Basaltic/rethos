export type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never;

export type Id = string | number | symbol;
export type Type = any;

export type TUpdateFn = () => void;
