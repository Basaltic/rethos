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

/**
 * Create Unique Type For State or Actions
 *
 * @param name give type a name will make debug easier
 * @returns
 */
export function createType(typeName: string) {
  const type = function (): any {
    if (arguments.length !== 3) {
      throw new Error('@IServiceName-decorator can only be used to decorate a parameter');
    }
  };

  type.toString = () => typeName;

  return type;
}
