import React from 'react';
import './app.scss';
import { Router, Link } from '@reach/router';
import Logo from '../assets/logo_wide.svg';
import PageSearch from './PageSearch';
import PageFilm from './PageFilm';

function App() {
  return (
    <div className="wrapper">
      <header>
        <Link className="logo" to="/" title="Star Wars Logo">
          <span className="logo__svg"><Logo /></span>
          <span className="logo__text">Search Engine</span>
        </Link>
      </header>
      <Router>
        <PageSearch path="/" />
        <PageFilm path="film/:filmId" />
      </Router>

    </div>
  );
}

export default App;
