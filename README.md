# Rethos

A Simple & Powerful Proxy Based State Management Libaray in React.

**Warning: It's unstable for now**

# Installation

```
npm install rethos

yarn add rethos

pnpm add rethos
```

# Requirement & Rules

* Prerequire **_React_** Installed
* Action is the **_only_** place to change the state
* Subscribe (Destruct) the state in **_functional component_**

# How It Works

Constructing...

# Basic Example

```tsx
import rethos from 'rethos';

// Create a store
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

  const { count } = useCouterState()
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


