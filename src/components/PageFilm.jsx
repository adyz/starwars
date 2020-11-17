import React from 'react';
import { navigate } from '@reach/router';
import API from '../utils/starWarsApi';
import IconBack from '../assets/back.svg';

function goBack() {
  navigate(-1);
}

// eslint-disable-next-line react/prop-types
function PageFilm({ filmId }) {
  const [state, setState] = React.useState({
    fetchState: 'idle',
    data: [],
  });

  React.useEffect(() => {
    if (filmId) {
      setState({
        fetchState: 'pending',
        data: [],
      });

      API.getFilm(filmId)
        .then((data) => data.json())
        .then((json) => {
          setState({
            fetchState: 'fulfilled',
            data: json,
          });
        }).catch(() => {
          setState({
            fetchState: 'error',
            data: [],
          });
        });
    }
  }, []);

  return (
    <div className="pageFilm">
      <button className="backButton" type="button" onClick={goBack}>
        <IconBack />
        Back
      </button>
      <div className="filmContent">
        {state.fetchState === 'fulfilled' && (
        <>
          <h1 className="filmTitle">{state.data.title}</h1>
          <p className="filmCrawl">{state.data.opening_crawl}</p>
          <p className="filmDetails">
            Director:
            {state.data.director}
          </p>
          <p className="filmDetails">
            Release date:
            {state.data.release_date}
          </p>
        </>
        )}
        {state.fetchState === 'pending' && (
        <>
          <p>Loading</p>
        </>
        )}
      </div>
    </div>
  );
}

export default PageFilm;
