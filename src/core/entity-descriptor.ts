import { IEntityProcessors } from './processor';
import { IRawState } from './observable-state';
import { Type } from './types';

/**
 * Describe the Store Structure
 */
export interface IEntityDescriptor<S extends IRawState = IRawState> {
  name: string;
  type: Type;
  state: S;
  actions: IEntityProcessors<S>;
}

/**
 * Create Store Instance
 */
export const createEntityDescriptor = <S extends IRawState<S>, A extends IEntityProcessors<S>>(props: {
  name: string;
  type?: Type;
  state: S;
  actions: A;
}) => {
  const { name, state, actions } = props;
  const type = props.type || createType(name);

  return {
    name,
    type,
    state,
    actions,
  };
};

/**
 * Create Unique Type For State or Actions
 *
 * @param name give type a name will make debug easier
 * @returns
 */
export const createType: (name?: string) => Type = (name?: string) => (name ? Symbol.for(name) : Symbol());

export function createDecorator(entityId: string) {
  const id = function (target: Function, key: string, index: number): any {
    if (arguments.length !== 3) {
      throw new Error('@IServiceName-decorator can only be used to decorate a parameter');
    }
  };

  id.toString = () => entityId;

  return id;
}

//
export const entity = createEntityDescriptor;
