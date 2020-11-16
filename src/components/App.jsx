import React from 'react';
import './app.scss';
import logoSrc from '../assets/logo.svg';
import starWarsSearch from '../utils/starWarsApi';

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
    <div>
      <a href="/" title="Star Wars Logo">
        <img src={logoSrc} alt="Star Wars Logo" />
      </a>
      <form action="">
        <input type="search" value={query} onChange={(e) => setQuety(e.target.value)} placeholder="Search for a movie title" />
        <button type="submit">Search</button>
      </form>

      {state?.data?.results?.map((film) => (
        <div>
          <a href="#test">{film.title}</a>
          <p><small>{film.opening_crawl}</small></p>
        </div>
      ))}
    </div>
  );
}

export default App;
