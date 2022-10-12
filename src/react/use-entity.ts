import { useMemo } from 'react';
import { IEntityDescriptor } from '../core/descriptor';
import { ExtractEntityProcessors } from '../core/processor';
import { Identifier, Type } from '../core/types';
import { globalContainer } from './default';
import { useContainer } from './hooks';
import { useForceUpdate } from './use-force-update';

/**
 *
 *
 * @param descriptor
 * @param id
 * @returns
 */
export function useEntity<D extends IEntityDescriptor<any>>(descriptor: D | Type, id?: Identifier) {
  // check if the container is existed, if not initialize the entity and use it directly
  // check if the container has the entity, if not register the descriptor and initialize the entity

  const updateFn = useForceUpdate();
  const container = useContainer() || globalContainer;

  return useMemo(() => {
    container.register(descriptor);

    const entity = typeof descriptor === 'object' ? container.get(descriptor.type, id) : container.get(descriptor, id);

    const state = entity.getState(updateFn) as D['state'];
    const processors = entity.getProcessors() as unknown as ExtractEntityProcessors<D['processors']>;

    return [state, processors] as [typeof state, typeof processors];
  }, [descriptor]);
}
