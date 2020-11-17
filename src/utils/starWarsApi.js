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

export function starWarsApi() {
  const BASE_URL = 'https://swapi.dev/api';
  return {
    searchFilm: (query) => {
      const URL = `${BASE_URL}/films/?search=`;
      const finalUrl = `${URL}${encodeURIComponent(query)}`;
      return baseFetch(finalUrl);
    },
    getFilm: (id) => {
      const URL = `${BASE_URL}/films`;
      const filnalUlr = `${URL}/${encodeURIComponent(id)}/`;
      return baseFetch(filnalUlr);
    },
    getCharacter: (id) => {
      const URL = `${BASE_URL}/people`;
      const filnalUlr = `${URL}/${encodeURIComponent(id)}/`;
      console.log({ filnalUlr });
      return baseFetch(filnalUlr);
    },
  };
}

const API = starWarsApi();
export {
  controller,
};
export default API;
