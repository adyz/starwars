import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { beforeAll, afterEach, afterAll } from 'vitest';

import { BrowserRouter } from 'react-router-dom';
import { apiURLs } from '../utils/starWarsApi';
import PageSearch from './PageSearch';

const urls = apiURLs();

const server = setupServer(
  http.get(urls.search('a'), () => HttpResponse.json({
    count: 4,
    next: null,
    previous: null,
    results: [{
      title: 'Test title',
      url: 'http://swapi.dev/api/films/1/',
    }],
  })),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('Renders empty', async () => {
  const { getByPlaceholderText } = render(<PageSearch />, { wrapper: BrowserRouter });
  const searchInput = getByPlaceholderText('Search for a movie title');
  expect(searchInput.value).toBe('');
});

it('Renders items when search', async () => {
  const { getByPlaceholderText, getByText } = render(<PageSearch />, { wrapper: BrowserRouter });
  const searchInput = getByPlaceholderText('Search for a movie title');
  fireEvent.change(searchInput, { target: { value: 'a' } });
  await waitFor(() => getByText('Test title'));
});

it('Renders error', async () => {
  server.use(
    http.get(urls.search('a'), () => HttpResponse(null, {
      status: 500,
      statusText: 'Out Of Apples',
    })),
  );
  const { getByPlaceholderText, getByText } = render(<PageSearch />, { wrapper: BrowserRouter });
  const searchInput = getByPlaceholderText('Search for a movie title');
  fireEvent.change(searchInput, { target: { value: 'a' } });
  await waitFor(() => getByText('Error showing search resuls'));
});

it('Renders empty if no resuls returned from server', async () => {
  server.use(
    http.get(urls.search('a'), () => HttpResponse.json({
      count: 0,
      next: null,
      previous: null,
      results: [],
    })),
  );
  const { getByPlaceholderText, getByText } = render(<PageSearch />, { wrapper: BrowserRouter });
  const searchInput = getByPlaceholderText('Search for a movie title');
  fireEvent.change(searchInput, { target: { value: 'a' } });
  await waitFor(() => getByText('No resuls found for'));
});
