# Rethos

A Small, Concise but Powerful State Management Libaray in React.

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
* Store state must be an object

# How It Works

Constructing...

# Basic Example

```typescript
import rethos from 'rethos';

// Create a store
// - First argument: the state structure and default values
// - Second argument: actions to change the state
const counterStore = rethos.create(
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

  const { count } = counterStore.state
  const { inc, dec } = counterStore.action

  return <div>
    <div>count: {count}</div>
    <div>
      <button onClick={inc}>Inc</button>
      <button onClick={dec}>Dec</button>
    </div>
  </div>
}

const CounterComponent2 = () => {

  const { count } = counterStore.state
  const { inc, dec } = counterStore.action

  return <div>
    <div>count: {count}</div>
    <div>
      <button onClick={inc}>Inc</button>
      <button onClick={dec}>Dec</button>
    </div>
  </div>
}

// Click the button & Two component will update together
```


