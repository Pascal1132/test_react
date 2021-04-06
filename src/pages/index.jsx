import React from "react";
import Button from "react-bootstrap/Button";
import logo from "../logo.svg";
import "../App.css";
import axios from "axios";


const MainPage = () => {
    
  function handleClick(e) {
    e.preventDefault();
    const article = { title: 'React POST Request Example', headers: {'Access-Control-Allow-Origin': '*'}};
    axios.post('https://react_tests.local/test_jeu/create_url_room.php', article)
        .then(response => {
            return response.data.data;
            
            //window.location.replace("/room/"+response.data.id_mask);
        }).then(data => {
            window.location.replace("/room/"+data.id_mask);
            console.log(data.id);
        });
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Bienvenue sur le site web de codename personnel à Pascal.</p>
        <Button variant="secondary" onClick={handleClick}>
          Créer un salon
        </Button>
      </header>
    </div>
  );
};

export default MainPage;
