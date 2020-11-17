import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import PageSearch from './PageSearch';

const server = setupServer(
  rest.get('https://swapi.dev/api/films/', (req, res, ctx) => res(ctx.json({
    count: 4,
    next: null,
    previous: null,
    results: [{
      title: 'Test title',
      url: 'http://swapi.dev/api/films/1/',
    }],
  }))),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('Renders empty', async () => {
  const { getByPlaceholderText } = render(<PageSearch />);
  const searchInput = getByPlaceholderText('Search for a movie title');
  expect(searchInput.value).toBe('');
});

it('Renders items when search', async () => {
  const { getByPlaceholderText, getByText } = render(<PageSearch />);
  const searchInput = getByPlaceholderText('Search for a movie title');
  fireEvent.change(searchInput, { target: { value: 'a' } });
  await waitFor(() => getByText('Test title'));
});

it('Renders error', async () => {
  server.use(
    rest.get('https://swapi.dev/api/films/', (req, res, ctx) => res(ctx.status(500))),
  );
  const { getByPlaceholderText, getByText } = render(<PageSearch />);
  const searchInput = getByPlaceholderText('Search for a movie title');
  fireEvent.change(searchInput, { target: { value: 'a' } });
  await waitFor(() => getByText('Error showing search resuls'));
});

it('Renders empty if no resuls returned from server', async () => {
  server.use(
    rest.get('https://swapi.dev/api/films/', (req, res, ctx) => res(ctx.json({
      count: 0,
      next: null,
      previous: null,
      results: [],
    }))),
  );
  const { getByPlaceholderText, getByText } = render(<PageSearch />);
  const searchInput = getByPlaceholderText('Search for a movie title');
  fireEvent.change(searchInput, { target: { value: 'a' } });
  await waitFor(() => getByText('No resuls found for'));
});
