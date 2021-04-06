import React, { useState, useEffect } from "react";
import "../App.css";
import { Link } from "react-router-dom";
const ENDPOINT = "127.0.0.1:8085";

var conn = new WebSocket('ws://localhost:8085/');

const WaitingRoomPage = () => {
  const [response, setResponse] = useState("");
  const [room, setRoom] = useState("");
  
  useEffect(() => {
    
      conn.onmessage = function(e) { 
        let data = JSON.parse(e.data);
        if(data !== null && data['clients']){
          console.log('connected : ' + Object.keys(data['clients']).length);
        }
        
       };

      conn.onopen = function(e) { conn.send(JSON.stringify({
        action: 'clients',
        method: 'add',
        data: {
          room: window.location.href
        }
      }));
      
      setTimeout(function() {
        conn.send(JSON.stringify({
          action: 'clients',
          method: 'get',
          data: {
            room: window.location.href
          }
        }));
      }, 500);
    };
  }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <h2>Bienvenue dans le salon</h2>
        <p>Vous pouvez partager ce lien</p>
        <code>{window.location.href}</code>
        <br />
        <Link to="/">Retourner à l'accueil</Link>
      </header>
    </div>
  );
};

export default WaitingRoomPage;
