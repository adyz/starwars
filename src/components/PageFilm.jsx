import React from 'react';
import { navigate } from '@reach/router';
import API, { getID, controller } from '../utils/starWarsApi';
import IconBack from '../assets/back.svg';

function goBack() {
  navigate(-1);
}

async function getCharacters(characters) {
  return Promise.all(characters.map((url) => {
    const id = getID(url);
    return new Promise((res, rej) => {
      API.getCharacter(id).then((data) => {
        res(data);
      }).catch((e) => {
        rej(e);
      });
    });
  }));
}

// eslint-disable-next-line react/prop-types
function PageFilm({ filmId }) {
  const [state, setState] = React.useState({
    fetchState: 'idle',
    data: [],
  });

  const getFilmData = React.useCallback(async () => {
    setState({
      fetchState: 'pending',
      data: [],
    });

    try {
      const filmData = await API.getFilm(filmId);
      const characters = await getCharacters(filmData.characters);
      setState({
        fetchState: 'fulfilled',
        data: { ...filmData, characters },
      });
    } catch (e) {
      if (e.name === 'AbortError') {
        console.log('Aborted');
      } else {
        setState({
          fetchState: 'error',
          data: e.message,
        });
      }
    }
  }, [filmId]);

  React.useEffect(() => {
    if (filmId) {
      getFilmData();
    }
    return () => {
      if (controller) {
        controller.abort();
      }
    };
  }, [filmId, getFilmData]);

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
            {state.data.characters.map(
              (character, index) => (
                <span key={character.name}>
                  {character.name}
                  {state.data.characters.length - 1 === index ? '' : ','}
                  {' '}
                </span>
              ),
            )}
          </p>
        </>
        )}
      </div>
    </div>
  );
}

export default PageFilm;
