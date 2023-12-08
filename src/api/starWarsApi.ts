let ogController;
let signal;

export function baseFetch(url: string, config = {}): Promise<any> {
  ogController = new AbortController();
  signal = ogController.signal;
  const newConf = {
    method: 'GET',
    signal,
    ...config,
  };
  const promise = new Promise((resolve, reject) => {
    fetch(url, newConf)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          return res.json();
        }
        throw Error(res.statusText);
      })
      .then((json) => resolve(json))
      .catch((error) => {
        try {
          reject(JSON.parse(error));
        } catch (e) {
          reject(error);
        }
      });
  });
  return promise;
}

export function getID(url: string) {
  const urlSplit = url.split('/');
  return urlSplit[urlSplit.length - 2];
}

function apiURLs() {
  const BASE = 'https://swapi.dev/api';

  return {
    base: BASE,
    search: (q: string) => {
      const URL = `${BASE}/films/?search=`;
      return `${URL}${encodeURIComponent(q)}`;
    },
    film: (id: string) => {
      const URL = `${BASE}/films`;
      return `${URL}/${encodeURIComponent(id)}/`;
    },
    character: (id: string) => {
      const URL = `${BASE}/people`;
      return `${URL}/${encodeURIComponent(id)}/`;
    },
  };
}


export type FilmCharacter = {
  name: string;
}

export type Film = {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  created: string;
  edited: string;
  url: string;
};

export type FilmWithCharacters = Omit<Film, 'characters'> & {
  characters: FilmCharacter[];
};

export type SearchResults = {
  count: number;
  next: string;
  previous: string;
  results: Film[];
};

export function starWarsApi() {
  const urls = apiURLs();
  return {
    searchFilm: (query: string): Promise<SearchResults> => baseFetch(urls.search(query)),
    getFilm: (id: string):Promise<Film> => {
      return baseFetch(urls.film(id));
    },
    getCharacter: (id: string): Promise<FilmCharacter> => {
      return baseFetch(urls.character(id));
    },
    getCharacters: async (characters: string[]): Promise<FilmCharacter[]> => {
      const promises = characters.map(async (character) => await starWarsApi().getCharacter(character));
      const data = await Promise.all(promises);
      return data;
    },
  };
}

const API = starWarsApi();
export {
  apiURLs,
};

export const controller: AbortController = ogController!;
export default API;
