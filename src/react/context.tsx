import React, { createContext } from 'react';
import { Container } from '../core/container';
import { globalContainer } from './default';

export const Context = createContext<Container>(globalContainer);
export const Provider = (props: { value?: Container; children: React.ReactChild }) => (
  <Context.Provider value={props.value || globalContainer}>{props.children}</Context.Provider>
);
