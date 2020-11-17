import React from 'react';
import {
  render,
} from '@testing-library/react';

import App from './App';

it('Works', () => {
  const { getAllByText } = render(<App />);
  const header = getAllByText(/search engine/i);
  expect(header).toBeTruthy();
});
