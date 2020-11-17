import React, { useEffect } from 'react';
import { Link } from '@reach/router';

import API from '../utils/starWarsApi';
import IconSearch from '../assets/search.svg';

function useSearchQuery(initialValue = '') {
  const [query, setQuety] = React.useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    return search || initialValue;
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('search', query);
    const newRelativePathQuery = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState(false, false, newRelativePathQuery);
  }, [query]);

  return [query, setQuety];
}

function PageSearch() {
  const [query, setQuety] = useSearchQuery('');

  const [state, setState] = React.useState({
    fetchState: 'idle',
    data: [],
  });
  React.useEffect(() => {
    if (query) {
      setState({
        fetchState: 'pending',
        data: [],
      });

      API.searchFilm(query)
        .then((data) => data.json())
        .then((json) => {
          setState({
            fetchState: 'fullfilled',
            data: json,
          });
        }).catch(() => {
          setState({
            fetchState: 'error',
            data: [],
          });
        });
    }
  }, [query]);
  return (
    <div className="pageSearch">
      <form className="searchForm" action="">
        <button className="searchForm__icon" type="submit">
          <IconSearch />
        </button>
        <input
          className="searchForm__input"
          type="search"
          value={query}
          onChange={(e) => setQuety(e.target.value)}
          placeholder="Search for a movie title"
        />
      </form>

      <div className="searchResults">
        {state?.data?.results?.map((film) => {
          const urlSplit = film.url.split('/');
          const filmId = urlSplit[urlSplit.length - 2];
          return <Link key={film.title} to={`/film/${filmId}`} className="searchResults__item" href="#test">{film.title}</Link>;
        })}
      </div>
    </div>
  );
}

export default PageSearch;
