import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/app';
import { HashRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
