import { Container } from '../core/container';
import { IEntityDescriptor } from '../core/entity-descriptor';
import { ExtractEntityProcessor } from '../core/processor';
import { useContainer } from './hooks';
import { useForceUpdate } from './use-force-update';

/**
 *
 */
export function useEntity<D extends IEntityDescriptor>(descriptor: D) {
  // check if the container is existed, if not initialize the entity and use it directly
  // check if the container has the entity, if not register the desc and initialize the entity

  const updateFn = useForceUpdate();
  const container = useContainer() || new Container();
  container.register(descriptor);

  const entity = container.get(descriptor.type);

  const state = entity.getState(updateFn) as D['state'];
  const processor = entity.getLocalProcessors() as unknown as ExtractEntityProcessor<typeof descriptor['actions']>;

  return [state, processor];
}
