import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';  // For Tailwind if added

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
