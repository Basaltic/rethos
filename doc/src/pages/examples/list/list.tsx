import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { createStore } from '../../../../../src/create';
import { Page } from '../../../containers/page';

const listStore = createStore(
  { itemIds: ['12'] },
  {
    push: (s, id: string) => s.itemIds.push(id),
    pop: (s) => s.itemIds.pop(),
    delete: (s, i: number) => {
      console.log('delete');
      s.itemIds.splice(i, 1);
      console.log(JSON.stringify(s));
    },
  },
);

/**
 * 列表
 */
export const ListPage = () => {
  const { itemIds } = listStore.useState();
  const actions = listStore.getActions();

  const handlePushItem = () => {
    const newId = nanoid();
    actions.push(newId);
  };

  const handlePopItem = () => {
    actions.pop();
  };

  const deleteItem = (i: number) => () => actions.delete(i);

  return (
    <Page>
      <div>
        <div className="flex gap-2">
          <button className="btn" onClick={handlePushItem}>
            新增
          </button>
          <button className="btn" onClick={handlePopItem}>
            减少
          </button>
        </div>
        <div className="flex gap-2">
          {itemIds.map((id, i) => (
            <ListItem key={id} id={id} onDelete={deleteItem(i)} />
          ))}
        </div>
      </div>
    </Page>
  );
};

const listItemStore = createStore(
  { title: 'default Title' },
  {
    changeTitle: (s, t) => (s.title = t),
  },
);

const ListItem = (props: { id: string | number; onDelete: () => void }) => {
  const { id, onDelete } = props;
  const state = listItemStore.useState(id);
  const actions = listItemStore.getActions(id);

  const [title, setTitle] = useState('');

  const handleTitleChange = () => actions.changeTitle(title);

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{state.title}</h2>
        <div>
          <input className="input w-full max-w-xs" placeholder="输入新的标题" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={handleTitleChange}>
            确认修改
          </button>
          <button className="btn btn-error" onClick={onDelete}>
            删除
          </button>
        </div>
      </div>
    </div>
  );
};
