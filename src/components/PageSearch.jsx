import React from 'react';
import { Link } from '@reach/router';

import useSearchQuery from './cutomHooks/userSearchQuery';
import useDebounce from './cutomHooks/useDebounce';
import API, { getID, controller } from '../utils/starWarsApi';

import IconSearch from '../assets/search.svg';

function PageSearch() {
  const [query, setQuery] = useSearchQuery('');
  const [state, setState] = React.useState({
    fetchState: 'idle',
    data: [],
  });

  const debouncedQuery = useDebounce(query, 200);

  function getSearchData() {
    setState({
      fetchState: 'pending',
      data: [],
    });

    API.searchFilm(query)
      .then((json) => {
        setState({
          fetchState: 'fullfilled',
          data: json,
        });
      }).catch((e) => {
        if (e.name === 'AbortError') {
          console.log('Aborted');
        } else {
          setState({
            fetchState: 'error',
            data: [],
          });
        }
      });
  }

  React.useEffect(() => {
    if (controller) {
      controller.abort();
    }
    if (query) {
      getSearchData();
    } else {
      setState({
        fetchState: 'idle',
        data: [],
      });
    }
  }, [debouncedQuery]);

  React.useEffect(() => () => {
    if (controller) {
      controller.abort();
    }
  }, []);

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
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie title"
        />
      </form>

      <div className="searchResults">
        {state.fetchState === 'pending' && (
        <p className="searchResults__loading">
          Searching...
        </p>
        )}

        {state.fetchState === 'error' && (
        <p className="searchResults__error">
          Error showing search resuls
          {' '}
          <button onClick={getSearchData} type="button">Retry</button>
        </p>
        )}

        {query && state?.data?.results?.length === 0 && (
        <p className="searchResults__empty">
          No resuls found for
          {' '}
          <strong>{query}</strong>
        </p>
        )}
        {query && state?.data?.results?.map((film) => {
          const filmId = getID(film.url);
          return <Link key={film.title} to={`/film/${filmId}`} className="searchResults__item" href="#test">{film.title}</Link>;
        })}
      </div>
    </div>
  );
}

export default PageSearch;
