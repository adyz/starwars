// eslint-disable-next-line import/no-mutable-exports
let controller;
let signal;

export function baseFetch(url, config = {}) {
  controller = new AbortController();
  signal = controller.signal;
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
        throw Error(res);
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

export function getID(url) {
  const urlSplit = url.split('/');
  return urlSplit[urlSplit.length - 2];
}

function apiURLs() {
  const BASE = 'https://swapi.dev/api';

  return {
    base: BASE,
    search: (q) => {
      const URL = `${BASE}/films/?search=`;
      return `${URL}${encodeURIComponent(q)}`;
    },
    film: (id) => {
      const URL = `${BASE}/films`;
      return `${URL}/${encodeURIComponent(id)}/`;
    },
    character: (id) => {
      const URL = `${BASE}/people`;
      return `${URL}/${encodeURIComponent(id)}/`;
    },
  };
}

export function starWarsApi() {
  const urls = apiURLs();
  return {
    searchFilm: (query) => baseFetch(urls.search(query)),
    getFilm: (id) => {
      console.log('Getting film', urls.film(id));
      return baseFetch(urls.film(id));
    },
    getCharacter: (id) => baseFetch(urls.character(id)),
  };
}

const API = starWarsApi();
export {
  controller,
  apiURLs,
};
export default API;
