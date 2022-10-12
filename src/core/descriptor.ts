import { EntityProcessors, Processors } from './processor';
import { IRawState } from './observable-state';
import { createType, Type } from './types';

export interface IDescriptor {
  name?: string;
  type: Type;
}

/**
 * Describe the Store Structure
 */
export interface IEntityDescriptor<S extends IRawState = IRawState> extends IDescriptor {
  state: S;
  processors: EntityProcessors<S>;
}

/**
 * Create Store Instance
 */
export function createEntityDescriptor<S extends IRawState<S>, A extends EntityProcessors<S>>(props: {
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
 * Describe the Store Structure
 */
export interface IProcessorsDescriptor extends IDescriptor {
  processors: Processors;
}

/**
 * Create Store Instance
 */
export function createProcessorsDescriptor<A extends Processors>(props: {
  name?: string;
  type?: Type;
  processors: A;
}): IProcessorsDescriptor {
  const { name = '', processors } = props;
  const type = props.type || createType(name);

  return {
    name,
    type,
    processors,
  };
}

export const entity = createEntityDescriptor;
export const processors = createEntityDescriptor;
