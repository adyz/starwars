let controller: AbortController | null = null
let signal

export async function baseFetch (url: string, config = {}): Promise<any> {
  controller = new AbortController()
  signal = controller.signal
  const newConf = {
    method: 'GET',
    signal,
    ...config
  }
  const promise = new Promise((resolve, reject) => {
    fetch(url, newConf)
      .then(async (res) => {
        if (res.status >= 200 && res.status <= 299) {
          return await res.json()
        }
        throw Error(res.statusText)
      })
      .then((json) => { resolve(json) })
      .catch((error) => {
        try {
          reject(JSON.parse(error))
        } catch (e) {
          reject(error)
        }
      })
  })
  return await promise
}

export function getID (url: string): string {
  const urlSplit = url.split('/')
  return urlSplit[urlSplit.length - 2]
}

export function getApiUrls (): {
  base: string
  search: (q: string) => string
  film: (id: string) => string
  character: (id: string) => string
} {
  const BASE = 'https://swapi.dev/api'

  return {
    base: BASE,
    search: (q: string) => {
      const URL = `${BASE}/films/?search=`
      return `${URL}${encodeURIComponent(q)}`
    },
    film: (id: string) => {
      const URL = `${BASE}/films`
      return `${URL}/${encodeURIComponent(id)}/`
    },
    character: (id: string) => {
      const URL = `${BASE}/people`
      return `${URL}/${encodeURIComponent(id)}/`
    }
  }
}

export interface FilmCharacter {
  name: string
}

export interface Film {
  title: string
  episode_id: number
  opening_crawl: string
  director: string
  producer: string
  release_date: string
  characters: string[]
  planets: string[]
  starships: string[]
  vehicles: string[]
  species: string[]
  created: string
  edited: string
  url: string
}

export type FilmWithCharacters = Omit<Film, 'characters'> & {
  characters: FilmCharacter[]
}

export interface SearchResults {
  count: number
  next: string
  previous: string
  results: Film[]
}

export function starWarsApi (): {
  searchFilm: (query: string) => Promise<SearchResults>
  getFilm: (id: string) => Promise<Film>
  getCharacter: (id: string) => Promise<FilmCharacter>
  getCharacters: (characters: string[]) => Promise<FilmCharacter[]>
} {
  const urls = getApiUrls()
  return {
    searchFilm: async (query: string): Promise<SearchResults> => await baseFetch(urls.search(query)),
    getFilm: async (id: string): Promise<Film> => {
      return await baseFetch(urls.film(id))
    },
    getCharacter: async (id: string): Promise<FilmCharacter> => {
      return await baseFetch(urls.character(id))
    },
    getCharacters: async (characters: string[]): Promise<FilmCharacter[]> => {
      const promises = characters.map(character => starWarsApi().getCharacter(character))
      try {
        return await Promise.all(promises)
      } catch (e) {
        console.error(e)
        return []
      }
    }
  }
}

const API = starWarsApi()

export default API

export { controller }
