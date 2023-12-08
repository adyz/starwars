import React from 'react'

import { Link } from 'react-router-dom'
import useSearchQuery from './customHooks/userSearchQuery'
import useDebounce from './customHooks/useDebounce'
import API, { getID, abort, type SearchResults } from '../api/starWarsApi'

import IconSearch from '../assets/search.svg'

function PageSearch () {
  const [query, setQuery] = useSearchQuery('')
  const [state, setState] = React.useState<
  {
    fetchState: 'idle' | 'pending' | 'fulfilled' | 'error'
    data: SearchResults | null
  }
  >({
    fetchState: 'idle',
    data: null
  })

  const debouncedQuery = useDebounce(query, 200)

  const getSearchData = React.useCallback(() => {
    setState({
      fetchState: 'pending',
      data: null
    })

    API.searchFilm(debouncedQuery)
      .then((json) => {
        setState({
          fetchState: 'fulfilled',
          data: json
        })
      }).catch((e) => {
        if (e.name === 'AbortError') {
          console.log('Aborted')
        } else {
          setState({
            fetchState: 'error',
            data: null
          })
        }
      })
  }, [debouncedQuery])

  React.useEffect(() => {
    if (abort) {
      abort()
    }
    if (debouncedQuery) {
      getSearchData()
    } else {
      setState({
        fetchState: 'idle',
        data: null
      })
    }
  }, [getSearchData, debouncedQuery])

  React.useEffect(() => () => {
    if (abort) {
      abort()
    }
  }, [])

  return (
    <div className="pageSearch">
      <form className="searchForm" action="">
        <button aria-label="Search" className="searchForm__icon" type="submit">
          <IconSearch />
        </button>
        <input
          className="searchForm__input"
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value) }}
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
          Error showing search results
          {' '}
          <button onClick={getSearchData} type="button">Retry</button>
        </p>
        )}

        {query && state?.data?.results?.length === 0 && (
        <p className="searchResults__empty">
          No results found for
          {' '}
          <strong>{query}</strong>
        </p>
        )}
        {query && state?.data?.results?.map((film) => {
          const filmId = getID(film.url)
          return <Link key={film.title} to={`/film/${filmId}`} className="searchResults__item">{film.title}</Link>
        })}
      </div>
    </div>
  )
}

export default PageSearch
