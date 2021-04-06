import React, { useState, useEffect } from "react";
import "../App.css";
import io from "socket.io-client";
import { Link } from "react-router-dom";
const ENDPOINT = "127.0.0.1:8085";



const WaitingRoomPage = () => {
  const [response, setResponse] = useState("");
  const [room, setRoom] = useState("");
  
    useEffect(()=>{
      const room = window.location.href;
      let socket = io(ENDPOINT);
      setRoom(room);
      socket.emit('join', {room});
    }, [ENDPOINT, window.location.href]);
  

 

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
