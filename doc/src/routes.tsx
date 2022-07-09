import { RouteObject } from 'react-router-dom';
import { SimpleCounterPage } from './pages/examples/counter';
import StartPage from './pages/docs/start.mdx';

export interface SuperRouteObject extends RouteObject {
  name: string;
}

export const routes: SuperRouteObject[] = [
  // Docs
  {
    name: 'start',
    path: '/docs/start',
    element: <StartPage />,
  },

  // Examples
  {
    name: '简单累加器',
    path: '/',
    element: <SimpleCounterPage />,
  },
];
