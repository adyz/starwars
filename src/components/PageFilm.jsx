import React from 'react';
import { navigate } from '@reach/router';
import API from '../utils/starWarsApi';
import IconBack from '../assets/back.svg';

function goBack() {
  navigate(-1);
}

function getID(url) {
  const urlSplit = url.split('/');
  return urlSplit[urlSplit.length - 2];
}

async function getCharacters(characters) {
  return Promise.all(characters.map(async (url) => {
    const id = getID(url);
    return API.getCharacter(id).then((res) => res.json());
  }));
}

// eslint-disable-next-line react/prop-types
function PageFilm({ filmId }) {
  const [state, setState] = React.useState({
    fetchState: 'idle',
    data: [],
  });

  function getFilmData() {
    setState({
      fetchState: 'pending',
      data: [],
    });

    API.getFilm(filmId)
      .then((data) => data.json())
      .then(async (json) => {
        console.log('done', { json });
        if (json.characters.length > 0) {
          const characters = await getCharacters(json.characters);
          setState({
            fetchState: 'fulfilled',
            data: { ...json, characters },
          });
        } else {
          setState({
            fetchState: 'fulfilled',
            data: json,
          });
        }
      }).catch(() => {
        setState({
          fetchState: 'error',
          data: [],
        });
      });
  }

  React.useEffect(() => {
    console.log('Here');
    if (filmId) {
      console.log('filmId');
      getFilmData();
    }
  }, []);

  return (
    <div className="pageFilm">
      <button className="backButton" type="button" onClick={goBack}>
        <IconBack />
        Back
      </button>
      <div className="filmContent">
        {state.fetchState === 'pending' && (
        <>
          <p>Loading...</p>
        </>
        )}
        {state.fetchState === 'error' && (
        <>
          <p>
            Loading failed
            {' '}
            <button type="button" onClick={getFilmData}>Retry</button>
          </p>
        </>
        )}
        {state.fetchState === 'fulfilled' && (
        <>
          <h1 className="filmTitle">{state.data.title}</h1>
          <p className="filmCrawl">{state.data.opening_crawl}</p>
          <p className="filmDetails">
            <strong>Director: </strong>
            {state.data.director}
          </p>
          <p className="filmDetails">
            <strong>Release date: </strong>
            {state.data.release_date}
          </p>
          <p className="filmDetails">
            <strong>Characters: </strong>
            {state.data.characters.map((character) => <span>{character.name}</span>)}
          </p>
        </>
        )}
      </div>
    </div>
  );
}

export default PageFilm;
