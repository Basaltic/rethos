import { TState } from './types';

/**
 * A middleware is function that is used to add extra logic before or after action
 * - M1, M2, M3
 * - execute order: M1b -> M2b -> M3b action -> M1b -> M2b -> M3b
 */
export interface IMiddleware<S extends TState = TState> {
  beforeAction(s: S): void;
  afterAction(s: S): void;
}
