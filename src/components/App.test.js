import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'

import App from './App';

it('Works', () => {
    const {getAllByText} = render(<App />)
    const header = getAllByText(/star wars/i)
    expect(header).toBeTruthy();
});