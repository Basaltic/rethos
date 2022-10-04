简体中文 | [English](https://github.com/Basaltic/rethos/blob/main/README.en.md)

# Rethos 

[![NPM Version](https://img.shields.io/npm/v/rethos?style=flat&colorA=brightgreen&colorB=lightgrey)](https://www.npmjs.com/package/rethos)
[![Build Size](https://img.shields.io/bundlephobia/minzip/rethos?label=bundle%20size&style=flat&colorA=brightgreen&colorB=lightgrey)](https://bundlephobia.com/package/rethos)


实验性的状态管理库


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
// container.ts

import { Container } from 'rethos'

export const container = new Container();

```

### 注入到React上下文

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { container } from './container'


const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <Provider value={container}>
    <App />
  </Provider>
)
```

### 创建状态实体

```ts
// counter-model.ts

import { entityDescriptor } from 'rethos'
import { container } from './container'

// 定义状态实体
export const counterEntityDescriptor = entityDescriptor({
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

// （可选）注册到容器中
container.add(counterStoreDescriptor);

```

### 在组件中订阅状态、更改状态
```tsx
import React from 'react'
import { useEntity } from 'rethos'
import { CounterStoreType } from './counter-store.ts'

export const Counter = () => {
  // 未注册的实体会自动注册到容器中
  const [state, processors] = useEntity(counterEntityDescriptor)
  const { count } = state

  return <div>
    <div>当前计数：{count}</div>
    <button onClick={() => processors.inc()}>增加</button>
    <button onClick={() => processors.dec()}>减少</button>
  </div>
}

```

# 概念

### 状态实体（entity）



### 处理器（processor）

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
