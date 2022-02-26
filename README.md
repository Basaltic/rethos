# Rethos 

[![NPM Version](https://img.shields.io/npm/v/rethos?style=flat&colorA=brightgreen&colorB=lightgrey)](https://www.npmjs.com/package/rethos)
[![Build Size](https://img.shields.io/bundlephobia/minzip/rethos?label=bundle%20size&style=flat&colorA=brightgreen&colorB=lightgrey)](https://bundlephobia.com/result?p=zustand)

A small, simple but powerful proxy based state management libaray in react. 

# Hightlights

* **Small**, about 1kb gzip
* **Minimal Api**, only one api to create store (or store family), manage state & action
* **Auto Select**, no select function needed, make code clean
* **Flux**, simpified flux architecture, state only can be changed in actions

# Installation

```bash
npm install rethos # or yarn add rethos or pnpm add rethos
```

# Basic Example

```tsx
import rethos from 'rethos';

// create a store
// return two hooks
// 1. state hook
// 2. action hook
const [useCouterState, useCouterAction] = rethos.create(
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

# How It Works

Constructing...

# LICENSE

[MIT](https://github.com/Basaltic/rethos/blob/main/LICENSE)
