import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/app';
import { HashRouter } from 'react-router-dom';
import { Provider } from '../../src/main';
import { store } from './store';

ReactDOM.render(
  <React.StrictMode>
    <Provider value={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
