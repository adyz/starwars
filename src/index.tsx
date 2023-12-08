import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App'

// Render your React component instead
const rootEl = document.getElementById('star-wars-root')

if (rootEl === null) {
  throw new Error('Could not find root element')
}

const root = createRoot(rootEl)
root.render(<BrowserRouter><App /></BrowserRouter>)
