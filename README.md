简体中文 | [English](https://github.com/Basaltic/rethos/blob/main/README.en.md)

# Rethos 

[![NPM Version](https://img.shields.io/npm/v/rethos?style=flat&colorA=brightgreen&colorB=lightgrey)](https://www.npmjs.com/package/rethos)
[![Build Size](https://img.shields.io/bundlephobia/minzip/rethos?label=bundle%20size&style=flat&colorA=brightgreen&colorB=lightgrey)](https://bundlephobia.com/result?p=zustand)

小巧、简洁、强大的React状态管理库。

* **简洁**：只有一个api，不存在过多的样板代码
* **自动订阅**：用到哪个状态就自动订阅该状态并变更，不需要写任何的 select 函数来手动指定
* **Flux架构**：遵循简化的flux架构，使得状态更可控和管理

# 安装

```bash
npm install rethos # or yarn add rethos or pnpm add rethos
```

# 如何使用？

## 1. 首先创建一个Store

创建一个Store，并分别传入默认的状态和action 方法，返回一个实例对象

```ts
import rethos from 'rethos';

const counterStore = rethos.createStore(
  { count: 1 },
  {
    inc: (s, gap) => (s.count += gap || 1)},
    dec: (s) => (s.count -= 1),
  },
);
```
## 2. 绑定组件

在组件中使用需要绑定的store的hook函数，rethos会自动绑定，并在值发生变化是自动触发组件的更新

```tsx
const CounterComponent1 = () => {
  const { count } = counterStore.useState()
  const { inc, dec } = counterStore.getActions();
  return <div>
    <div>count: {count}</div>
    <div>
      <button onClick={inc}>增加</button>
      <button onClick={() => inc(10)}>增加 10</button>
      <button onClick={dec}>减少</button>
    </div>
  </div>
}

const CounterComponent2 = () => {
  const { count } = useCouterState()
  return <div>
    <div>count: {count}</div>
  </div>
}

```


# 接口详情
## 创建Store接口
```ts
/**
 * 创建Store
 *
 * @param {Object} state 默认状态对象
 * @param {Object} action 一组修改状态的action方法
 * @returns [useState, getActions]
 */
function createStore<S extends TState, A = TAction<S>>(state: S, action?: A): [(id?: Id) => S,  (id?: Id) => Record<keyof A, () => void>] {

  /**
   * 状态hook，用于组件中自动订阅
   * 
   * @param {string | undefined} id identify the state in the family
   */
  function useState(id?: string): S {}

  /**
   * 获取 action 
   * 
   * @param {string | undefined} id identify the action in the family
   */
  function getActions(id?: string): Record<keyof A, () => void> {}

  return {useState, getActions}
}


```

# 浏览器兼容

| Browser | Supported |
|--|--|
| Chromium | ✅ |
| Edge | ✅ |
| Safari 10+ | ✅ |
| Firefox | ✅ |
| IE | ❌ |

# LICENSE

[MIT](https://github.com/Basaltic/rethos/blob/main/LICENSE)
