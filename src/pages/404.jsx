import React from "react";
import '../App.css';
import {Link} from "react-router-dom";

const Page404 = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>404 Not Found !</h1>
        <p>Tu peux tout de même créer un salon .</p>
        <Link className='App-link' to="/" >Créer un salon</Link>
      </header>
    </div>
  );
};

export default Page404;