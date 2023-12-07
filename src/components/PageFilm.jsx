import React from 'react';
import { useParams } from 'react-router-dom';
import API, { getID, controller } from '../utils/starWarsApi';
import IconBack from '../assets/back.svg';

function goBack() {
  window.history.back();
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

function PageFilm() {
  const { filmId } = useParams();
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
      console.log('FILM DATAAAAAA', filmData);
      if (!filmData.characters) {
        throw new Error('No data');
      }
      const characters = await getCharacters(filmData.characters);
      setState({
        fetchState: 'fulfilled',
        data: { ...filmData, characters },
      });
    } catch (e) {
      console.log('Error', JSON.stringify(e));
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
      <pre>
        {JSON.stringify({ filmId }, null, 2)}
      </pre>
      <button className="backButton" type="button" onClick={goBack}>
        <IconBack />
        Back
      </button>
      <div className="filmContent">
        {state.fetchState === 'pending' && (
        <p>Loading...</p>
        )}
        {state.fetchState === 'error' && (
        <p>
          Loading failed (
          {JSON.stringify(state.data)}
          )
          {' '}
          <button type="button" onClick={getFilmData}>Retry</button>
        </p>
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
