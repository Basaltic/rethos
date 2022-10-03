import { createContext } from 'react';
import { Container } from '../core/container';

export const Context = createContext<Container>(null as any);
export const Provider = Context.Provider;
