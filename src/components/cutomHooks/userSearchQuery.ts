import React from 'react'

function useSearchQuery (initialValue = ''): [
  string,
  React.Dispatch<React.SetStateAction<string>>
] {
  const [query, setQuery] = React.useState<
  string
  >(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const search = urlParams.get('search')
    return search ?? initialValue
  })

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('search', query)
    const newRelativePathQuery = `${window.location.pathname}?${urlParams.toString()}`
    window.history.replaceState(false, '', newRelativePathQuery)
  }, [query])

  return [query, setQuery]
}
export default useSearchQuery
