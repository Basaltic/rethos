import React, { useState } from 'react';
import { createStore } from '../../../../src/main';
import { nanoid } from 'nanoid';

const [useListState, getListActions] = createStore(
  { itemIds: ['12'] },
  {
    push: (s, id: string) => s.itemIds.push(id),
    pop: (s) => s.itemIds.pop(),
  },
);

/**
 * 列表
 */
export const List = () => {
  const { itemIds } = useListState();
  const actions = getListActions();

  const handlePushItem = () => {
    const newId = nanoid();
    actions.push(newId);
  };

  const handlePopItem = () => {
    actions.pop();
  };

  return (
    <div>
      <button onClick={handlePushItem}>push</button>
      <button onClick={handlePopItem}>pop</button>
      {itemIds.map((id) => (
        <ListItem key={id} id={id} />
      ))}
    </div>
  );
};

const [useListItemState, getListItemActions] = createStore(
  { title: 'default Title' },
  {
    changeTitle: (s, t) => (s.title = t),
  },
);

const ListItem = (props: { id: string | number }) => {
  const { id } = props;
  const state = useListItemState(id);
  const actions = getListItemActions(id);

  const [title, setTitle] = useState('');

  const handleTitleChange = () => actions.changeTitle(title);

  return (
    <div style={{ border: '1px solid black' }}>
      <h1>{state.title}</h1>
      <div>
        <input placeholder="输入新的标题" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button onClick={handleTitleChange}>确认</button>
      </div>
    </div>
  );
};
