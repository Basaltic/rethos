import { useContext } from 'react';
import { Container } from '../core/container';
import { Context } from './context';

/**
 * Get Store Container from the context
 *
 * @returns {Container}
 */
export function useContainer() {
  const storeContainer = useContext(Context) as Container;
  return storeContainer;
}
