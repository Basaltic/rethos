import { useMemo } from 'react';
import { IEntityDescriptor } from '../core/entity-descriptor';
import { ExtractEntityProcessor } from '../core/processor';
import { Identifier } from '../core/types';
import { globalContainer } from './default';
import { useContainer } from './hooks';
import { useForceUpdate } from './use-force-update';

/**
 *
 * @param descriptor
 * @param id
 * @returns
 */
export function useEntity<D extends IEntityDescriptor<any>>(descriptor: D, id?: Identifier) {
  // check if the container is existed, if not initialize the entity and use it directly
  // check if the container has the entity, if not register the desc and initialize the entity

  const updateFn = useForceUpdate();
  const container = useContainer() || globalContainer;

  return useMemo(() => {
    container.register(descriptor);

    const entity = container.get(descriptor.type, id);

    const state = entity.getState(updateFn) as D['state'];
    const processors = entity.getLocalProcessors() as unknown as ExtractEntityProcessor<typeof descriptor['processors']>;

    return [state, processors] as [typeof state, typeof processors];
  }, [descriptor]);
}
