import React from 'react';

export const Page = (props: JSX.ElementChildrenAttribute) => {
  return <div className="p-2">{props.children}</div>;
};
