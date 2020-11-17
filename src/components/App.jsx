import React from 'react';
import './app.scss';
import Logo from '../assets/logo_wide.svg';

import starWarsSearch from '../utils/starWarsApi';
import IconSearch from '../assets/search.svg';

function App() {
  const [query, setQuety] = React.useState('');

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

      starWarsSearch(query)
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
    <div className="wrapper">

      <header>
        <a className="logo" href="/" title="Star Wars Logo">
          <span className="logo__svg"><Logo /></span>
          <span className="logo__text">Search Engine</span>
        </a>
      </header>

      <div className="search">
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
          {state?.data?.results?.map((film) => (
            <a className="searchResults__item" href="#test">{film.title}</a>
          ))}
        </div>
      </div>

    </div>
  );
}

export default App;
