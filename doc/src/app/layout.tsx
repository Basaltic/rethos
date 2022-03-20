import React from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { SuperRouteObject } from '../routes';

export const Layout = (props: { children: any; routes: SuperRouteObject[] }) => {
  const { routes } = props;

  let location = useLocation();

  return (
    <div className="w-full h-full flex">
      {/* left menu */}
      <div className="h-full w-56 bg-base-200">
        <ul className="menu bg-base-100 w-56">
          {routes.map((route) => (
            <li key={route.name}>
              <Link className={matchPath(route.path || '', location.pathname) ? 'active' : ''} to={route.path || ''}>
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* pages */}
      <div>{props.children}</div>
    </div>
  );
};
