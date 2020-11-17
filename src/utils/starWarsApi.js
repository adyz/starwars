function starWarsApi() {
  const BASE_URL = 'https://swapi.dev/api';
  return {
    searchFilm: (query, config) => {
      const URL = `${BASE_URL}/films/?search=`;
      const newConf = {
        method: 'GET',
        ...config,
      };
      return fetch(`${URL}${encodeURIComponent(query)}`, newConf);
    },
    getFilm: (id, config) => {
      const URL = `${BASE_URL}/films`;
      const newConf = {
        method: 'GET',
        ...config,
      };
      const filnalUlr = `${URL}/${encodeURIComponent(id)}/`;
      console.log('filnalUlr', filnalUlr);
      return fetch(filnalUlr, newConf);
    },
  };
}

const API = starWarsApi();
export default API;
