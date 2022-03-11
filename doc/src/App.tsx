import { useState } from 'react';
import './App.css';
import { SimpleCounter } from './examples/simple-counter';
import { List } from './examples/list';

function App() {
  return (
    <div>
      <h1>Examples</h1>
      <div>Example 1</div>
      {/* <SimpleCounter /> */}
      <br />
      <div>Example 2</div>
      <List />
    </div>
  );
}

export default App;
