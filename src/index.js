import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';

const isProd = process.env.NODE_ENV === 'production';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter basename={isProd ? "/invoice-app" : ""}>
      <App />
    </HashRouter>
  </React.StrictMode>
);
