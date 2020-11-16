import React, { Component} from "react";
import './app.scss'
import logoSrc from '../assets/logo.svg';


function App(){
  const [query, setQuety] =  React.useState('');
  const [state, setState] = React.useState({
    fetchState: 'idle',
    data: []
  });


  React.useEffect(() => {
      if(query) {
        setState({
          fetchState: 'pending',
          data: []
        })
        
        fetch(`https://swapi.dev/api/films/?search=${encodeURIComponent(query)}`)
          .then((data) => data.json())
          .then((json) => {
            setState({
              fetchState: 'fullfilled',
              data: json
            })
          }).catch((e) => {
            setState({
              fetchState: 'error',
              data: []
            })
          }) 
      }
  }, [query])
  return(
    <div>
      <a href="/" title="Star Wars Logo">
        <img src={logoSrc} alt="Star Wars Logo" />
      </a>
      <form action="">
        <input type="search" value={query} onChange={(e) => setQuety(e.target.value)} placeholder="Search for a movie title" />
        <button>Search</button>
      </form>

      {state?.data?.results?.map((film) => {
        return <div>
            <a href="#">{film.title}</a>
            <p><small>{film.opening_crawl}</small></p>
        </div>
      })}
    </div>
  );
}

export default App;