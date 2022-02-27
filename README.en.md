[简体中文]() | English

# Rethos 

[![NPM Version](https://img.shields.io/npm/v/rethos?style=flat&colorA=brightgreen&colorB=lightgrey)](https://www.npmjs.com/package/rethos)
[![Build Size](https://img.shields.io/bundlephobia/minzip/rethos?label=bundle%20size&style=flat&colorA=brightgreen&colorB=lightgrey)](https://bundlephobia.com/result?p=zustand)

A small, simple but powerful proxy based state management libaray in react. 

* **Minimal Api**, only one api to create store (or store family), no extra boilerplate
* **Auto Subscribition**, no select function needed, make code clean
* **Flux Architecture**, simpified flux architecture, state only can be changed in actions
* **Small**, about 1kb gzip
# Installation

```bash
npm install rethos # or yarn add rethos or pnpm add rethos
```

# Basic Example

```tsx
import rethos from 'rethos';

// create a store, define the default state & actions
// return two hooks
// 1. state hook
// 2. action hook
const [useCouterState, useCouterAction] = rethos.createStore(
  {
    count: 1,
  },
  {
    inc: (s) => {
      s.count += 1;
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
  // call the action hook if you want to call the action
  const { inc, dec } = useCouterAction()

  return <div>
    <div>count: {count}</div>
    <div>
      <button onClick={inc}>Inc</button>
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
   * 
   * 
   * @param {string | undefined} id identify the state in the family
   */
  function useState(id?: string): S {}

  /**
   * 
   * @param {string | undefined} id identify the action in the family
   */
  function useAction(id?: string): Record<keyof A, () => void> {}

  return [useState, useAction]
}


```

# How It Works

Constructing...

# LICENSE

[MIT](https://github.com/Basaltic/rethos/blob/main/LICENSE)
