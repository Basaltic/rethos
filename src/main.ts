export type { IRawState as IStoreState } from './core/observable-state';
export type { IEntityProcessors as IStoreActions } from './core/processor';
export { Container as StoreContainer } from './core/container';
export { Provider, useStoreState, useStoreActions } from './react/hooks';
export { createEntityDescriptor as createStoreDescriptor, createType } from './core/entity-descriptor';
