import React, { Component} from "react";
import './app.scss'
import logoSrc from '../assets/logo.svg';
class App extends Component{
  render(){
    return(
      <div>
        <a href="/" title="Star Wars Logo">
          <img src={logoSrc} alt="Star Wars Logo" />
        </a>
        <form action="">
          <input type="search" placeholder="Search for a movie title" />
          <button>Search</button>
        </form>
      </div>
    );
  }
}

export default App;