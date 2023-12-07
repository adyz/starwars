import React from 'react';
import './app.scss';
import {
  Link, Routes, Route,
} from 'react-router-dom';

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
      <Routes>
        <Route element={<PageSearch />} path="/" />
        <Route element={<PageFilm />} path="film/:filmId" />
      </Routes>
    </div>
  );
}

export default App;
