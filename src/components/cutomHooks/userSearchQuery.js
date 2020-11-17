import React from 'react';

function useSearchQuery(initialValue = '') {
  const [query, setQuety] = React.useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    return search || initialValue;
  });

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('search', query);
    const newRelativePathQuery = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState(false, false, newRelativePathQuery);
  }, [query]);

  return [query, setQuety];
}

export default useSearchQuery;
