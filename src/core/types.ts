export type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never;

export type Identifier = string | number | Type;

export type Type =
  | symbol
  | {
      (target: Function, key: string, index: number): any;
      toString(): string;
    };

export type TUpdateFn = () => void;

export type JSONValue = string | number | boolean | null | bigint | { [x: string]: JSONValue } | Array<JSONValue>;
