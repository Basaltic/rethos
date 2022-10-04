import React, { createContext, ReactChildren } from 'react';
import { Container } from '../core/container';
import { globalContainer } from './default';

export const Context = createContext<Container>(globalContainer);
export const Provider = (props: { value?: Container; children: ReactChildren }) => (
  <Context.Provider value={props.value || globalContainer}>{props.children}</Context.Provider>
);
