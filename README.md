简体中文 | [English](https://github.com/Basaltic/rethos/blob/main/README.en.md)

# Rethos 

[![NPM Version](https://img.shields.io/npm/v/rethos?style=flat&colorA=brightgreen&colorB=lightgrey)](https://www.npmjs.com/package/rethos)
[![Build Size](https://img.shields.io/bundlephobia/minzip/rethos?label=bundle%20size&style=flat&colorA=brightgreen&colorB=lightgrey)](https://bundlephobia.com/result?p=zustand)

小巧、简洁、强大的React状态管理库。

* **自动订阅**：自动订阅该状态并变更，不需要写任何的 select 函数来手动指定
* **Flux架构**：遵循flux架构，使得状态更可控和管理

**⚠️：处于开发中，1.0之前api不稳定**

# 安装

```bash
npm install rethos 
# 或者 
yarn add rethos 
# 或者
pnpm add rethos
```

# 如何使用？

### 创建容器

```typescript
import { StoreContainer } from 'rethos'

export const storeContainer = new StoreContainer();

```

### 注入React上下文

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { storeContainer } from './store-config'


const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <Provider value={storeContainer}>
    <App />
  </Provider>
)
```

### 创建 Store

```ts
// counter-store.ts

import { createStoreDescriptor } from 'rethos'
import { storeContainer } from './store-config'

// 定义（描述）Store
const counterStoreDescriptor = createStoreDescriptor({
  name: 'counter',
  state: {
    count: 0,
  },
  actions: {
    inc: (state) => {
      state.count++;
    },
    dec: (state) => {
      state.count--;
    },
  },
});


export const CounterStoreType = simpleCounterStoreDescriptor.type;

// 这些类型是为了后续使用中更好的类型推断
export type ICounterStoreState = ISimpleCounterStore['state'];
export type ICounterStoreActions = ISimpleCounterStore['actions'];

// 注册到容器中
storeContainer.add(counterStoreDescriptor);

```

### 在组件中订阅状态、更改状态
```tsx
import React from 'react'
import { useStoreState, useStoreActions } from 'rethos'
import { CounterStoreType } from './counter-store.ts'

export const Counter = () => {
  const { count } = useStoreState(CounterStoreType)
  const counterActions = useStoreActions(CounterStoreType)

  return <div>
    <div>当前计数：{count}</div>
    <button onClick={() => counterActions.inc()}>增加</button>
    <button onClick={() => counterActions.dec()}>减少</button>
  </div>
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
