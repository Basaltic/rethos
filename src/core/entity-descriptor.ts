import { IEntityProcessors } from './processor';
import { IRawState } from './observable-state';
import { Type } from './types';

/**
 * Describe the Store Structure
 */
export interface IEntityDescriptor<S extends IRawState = IRawState> {
  name?: string;
  type: Type;
  state: S;
  processors: IEntityProcessors<S>;
}

/**
 * Create Store Instance
 */
export function createEntityDescriptor<S extends IRawState<S>, A extends IEntityProcessors<S>>(props: {
  name?: string;
  type?: Type;
  state: S;
  processors: A;
}): IEntityDescriptor<S> {
  const { name = '', state, processors } = props;
  const type = props.type || createType(name);

  return {
    name,
    type,
    state,
    processors,
  };
}

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

export function createEntityProcessors() {}

export const entity = createEntityDescriptor;
export const entityProcessor = createEntityProcessors;
