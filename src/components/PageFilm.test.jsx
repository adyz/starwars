import React from 'react';
import {
  render,
  waitFor,
} from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

import {
  MemoryRouter, Route, Routes,
} from 'react-router-dom';
import { apiURLs } from '../utils/starWarsApi';
import PageFilm from './PageFilm';

const urls = apiURLs();

const film1URL = urls.film('1');
const character1URL = urls.character('1');

const server = setupServer(
  http.get(film1URL, () => {
    console.log('HttpResponse for', film1URL);
    const res = HttpResponse.json({
      title: 'Test title',
      opening_crawl: 'It is a dark time',
      director: 'Irvin Kershner',
      release_date: '1980-05-17',
      characters: [character1URL],
    });
    return res;
  }),
  http.get(character1URL, () => {
    console.log('HttpResponse for', character1URL);
    const res = HttpResponse.json({
      name: 'Luke Skywalker',
    });
    return res;
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('Loads and renders film data', async () => {
  const { getByText } = render(<MemoryRouter initialEntries={['/film/1']}><Routes><Route element={<PageFilm />} path="film/:filmId" /></Routes></MemoryRouter>);
  await waitFor(() => getByText('Loading...'));
  await waitFor(() => getByText(/test title/ig));
});

it('Renders error', async () => {
  server.use(
    http.get(film1URL, () => {
      console.log('REQ');
      return HttpResponse(null, {
        status: 500,
        statusText: 'Out Of Apples',
      });
    }),
  );
  const { getByText } = render(<MemoryRouter initialEntries={['/film/1']}><Routes><Route element={<PageFilm />} path="film/:filmId" /></Routes></MemoryRouter>);
  await waitFor(() => getByText('Loading...'));
  await waitFor(() => getByText(/loading failed/ig));
});
