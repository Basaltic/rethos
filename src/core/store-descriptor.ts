import { IStoreActions } from './store-actions';
import { IStoreState } from './store-state';
import { StoreType } from './types';

/**
 * Describe the Store Structure
 */
export interface IStoreDescriptor<S extends IStoreState = IStoreState> {
  name: string;
  type: StoreType;
  state: S;
  actions: IStoreActions<S>;
}

/**
 * Create Store Instance
 */
export const createStoreDescriptor = <S extends IStoreState<S>, A extends IStoreActions<S>>(props: {
  name: string;
  state: S;
  actions: A;
}) => {
  const { name, state, actions } = props;
  const type = createType(name);

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
export const createType: (name?: string) => StoreType = (name?: string) => (name ? Symbol.for(name) : Symbol());
