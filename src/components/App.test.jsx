import React from 'react';
import {
  render,
} from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import App from './App';

it('Works', () => {
  const { getAllByText } = render(<App />, { wrapper: BrowserRouter });
  const header = getAllByText(/search engine/i);
  expect(header).toBeTruthy();
});
