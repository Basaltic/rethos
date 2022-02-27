[简体中文](https://github.com/Basaltic/rethos/blob/main/README.md) | English

# Rethos 

[![NPM Version](https://img.shields.io/npm/v/rethos?style=flat&colorA=brightgreen&colorB=lightgrey)](https://www.npmjs.com/package/rethos)
[![Build Size](https://img.shields.io/bundlephobia/minzip/rethos?label=bundle%20size&style=flat&colorA=brightgreen&colorB=lightgrey)](https://bundlephobia.com/result?p=zustand)

A small, simple but powerful proxy based state management libaray in react. 

* **Minimal Api**, only one api to create store (or store family), no extra boilerplate
* **Auto Subscribition**, no select function needed, make code clean
* **Flux Architecture**, simpified flux architecture, state only can be changed in actions

**It's not stable for now. Before v1.0, the api may be change.**
# Installation

```bash
npm install rethos # or yarn add rethos or pnpm add rethos
```

# Basic Example

```tsx
import rethos from 'rethos';

// create a store, define the default state & action & return two hooks
// 1. state hook
// 2. get action function
const [useCouterState, getCouterActions] = rethos.createStore(
  {
    count: 1,
  },
  {
    inc: (s, gap?) => {
      s.count += gap || 1;
    },
    dec: (s) => {
      s.count -= 1;
    },
  },
);

// Bind it in any functional component
const CounterComponent1 = () => {

  // add the hook at the top of component
  // destruct the state and it will auto update if the state is changed, that's it
  // you don't need to pass select functions
  const { count } = useCouterState()
  // call to get actions
  const { inc, dec } = getCouterActions()

  return <div>
    <div>count: {count}</div>
    <div>
      <button onClick={inc}>Inc</button>
      <button onClick={() => inc(10)}>Inc 10</button>
      <button onClick={dec}>Dec</button>
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

# Api Details

```ts
/**
 * Create A Store
 *
 * @param {Object} state a object represent the state, MUST BE A OBJECT!!
 * @param {TAction} action a collection of action that change the state in the store
 * @returns [useState, useAction]
 */
export function createStore<S extends TState, A = TAction<S>>(state: S, action?: A): [(id?: Id) => S,  (id?: Id) => Record<keyof A, () => void>] {

  /**
   * State Subscribe & Fetch Hook
   * 
   * @param {string | undefined} id identify the state in the family
   */
  function useState(id?: string): S {}

  /**
   * Get Action Instance, can be called in anywhere
   * 
   * @param {string | undefined} id identify the action in the family
   */
  function getActions(id?: string): Record<keyof A, () => void> {}

  return [useState, getActions]
}


```

# Browser Compatibility

| Browser | Supported |
|--|--|
| Chromium | ✅ |
| Edge | ✅ |
| Safari 10+ | ✅ |
| Firefox | ✅ |
| IE | ❌ |


# LICENSE

[MIT](https://github.com/Basaltic/rethos/blob/main/LICENSE)
