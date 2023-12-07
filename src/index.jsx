import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';

// Render your React component instead
const root = createRoot(document.getElementById('star-wars-root'));
root.render(<BrowserRouter><App /></BrowserRouter>);
