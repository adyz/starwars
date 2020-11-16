const starWarsSearch = (query, config) => {
  const URL = `https://vigilant-lichterman-be0b05.netlify.app/.netlify/functions/starwars/?search=`
  const newConf = {
    method: 'GET',
    ...config,
  };
  return fetch(`${URL}${encodeURIComponent(query)}`, newConf);
};

export default starWarsSearch;