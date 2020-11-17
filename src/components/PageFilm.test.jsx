import React from 'react';
import {
  render,
  waitFor,
} from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import PageFilm from './PageFilm';

const server = setupServer(
  rest.get('https://swapi.dev/api/films/1/', (req, res, ctx) => res(ctx.json({
    title: 'Test title',
    opening_crawl: 'It is a dark time',
    director: 'Irvin Kershner',
    release_date: '1980-05-17',
    characters: ['http://swapi.dev/api/people/1/'],
  }))),
  rest.get('https://swapi.dev/api/peaaople/1/', (req, res, ctx) => res(ctx.json({
    name: 'IG-88',
  }))),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('Starts with a loading screen', async () => {
  const { getByText } = render(<PageFilm filmId="1" />);
  await waitFor(() => getByText('Loading...'));
  await waitFor(() => getByText(/test title/ig));
});
