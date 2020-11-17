function baseFetch(url, config = {}) {
  const newConf = {
    method: 'GET',
    ...config,
  };
  return new Promise((resolve, reject) => {
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
}

function starWarsApi() {
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
      return baseFetch(filnalUlr);
    },
  };
}

const API = starWarsApi();
export default API;
