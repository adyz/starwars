const fetchClient = (url, config) => {
  const newConf = {
    method: 'GET',
    ...config,
  };
  return fetch(url, newConf);
};

export default fetchClient;
