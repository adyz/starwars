const starWarsSearch = (query, config) => {
  const newConf = {
    method: 'GET',
    ...config,
  };
  return fetch(`https://swapi.dev/api/films/?search=${encodeURIComponent(query)}`, newConf);
};

export default starWarsSearch;
