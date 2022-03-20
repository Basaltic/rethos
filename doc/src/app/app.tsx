import React from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from '../routes';
import { Layout } from './layout';

function App() {
  let element = useRoutes(routes);
  return <Layout routes={routes}>{element}</Layout>;
}

export default App;
