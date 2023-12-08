import React from 'react'
import { useParams } from 'react-router-dom'
import API, { getID, abort, type FilmWithCharacters } from '../api/starWarsApi'
import IconBack from '../assets/back.svg'

function goBack () {
  window.history.back()
}

function PageFilm () {
  const { filmId } = useParams()
  const [state, setState] = React.useState<{
    fetchState: 'idle' | 'pending' | 'fulfilled' | 'error'
    data: FilmWithCharacters | null
  }>({
    fetchState: 'idle',
    data: null
  })

  const getFilmData = React.useCallback(async () => {
    setState({
      fetchState: 'pending',
      data: null
    })

    if (!filmId) {
      return
    }

    try {
      const filmData = await API.getFilm(filmId)
      if (!filmData.characters) {
        throw new Error('No data')
      }
      const characters = await API.getCharacters(filmData.characters.map(getID))
      setState({
        fetchState: 'fulfilled',
        data: { ...filmData, characters }
      })
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          console.log('Aborted')
        } else {
          setState({
            fetchState: 'error',
            data: null
          })
        }
      } else {
        throw err
      }
    }
  }, [filmId])

  React.useEffect(() => {
    getFilmData()
    return () => {
      if (abort) {
        abort()
      }
    }
  }, [filmId, getFilmData])

  const handleRetry = React.useCallback(() => {
    getFilmData()
  }, [getFilmData])

  return (
    <div className="pageFilm">
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
          Loading failed
          <button type="button" onClick={handleRetry}>Retry</button>
        </p>
        )}
        {state.fetchState === 'fulfilled' && state.data && (
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
                  {state.data && state.data.characters.length - 1 === index ? '' : ','}
                  {' '}
                </span>
              )
            )}
          </p>
        </>
        )}
      </div>
    </div>
  )
}

export default PageFilm
