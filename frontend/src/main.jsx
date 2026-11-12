import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { readConfig } from './api.js';

const el = document.getElementById('subtelne-constructor') || document.getElementById('root');

if (el) {
  createRoot(el).render(
    <StrictMode>
      <App config={readConfig(el)} />
    </StrictMode>,
  );
}
