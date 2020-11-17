const starWarsSearch = (query, config) => {
  // const URL = `//vigilant-lichterman-be0b05.netlify.app/.netlify/functions/starwars/?search=`
  const URL = 'https://swapi.dev/api/films/?search=';
  const newConf = {
    method: 'GET',
    ...config,
  };
  return fetch(`${URL}${encodeURIComponent(query)}`, newConf);
};

export default starWarsSearch;
