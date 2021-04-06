import React, { useState, useEffect } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import Cookies from 'universal-cookie';
const cookies = new Cookies();


var conn = new WebSocket('ws://localhost:8085/');

const WaitingRoomPage = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [is_connected, setIsConnected] = useState(false);
  const [room, setRoom] = useState("");
  const [role, setRole] = useState("");
  const [clients, setClients] = useState("");
  const [client_id, setClientId] = useState(-1);
  useEffect( () => {
    if(cookies.get('client_id')){
      setClientId(cookies.get('client_id'));
    }
      conn.onmessage = function(e) { 
        let data = JSON.parse(e.data);
        if(data !== null){
          if(data['clients']){
            setClients(data['clients']);
          }
          if(data['disconnect']){
            conn.close();
            setMessage(data['disconnect']);
          }
          if(data['role']){
            setRole(data['role']);
          }
          if(data['id']){
            cookies.set('client_id', data['id'], { path: '/' });
          }
          if(data['room']){
            setRoom(data['room']);
          }
        }
        setIsConnected(true);
       };
      conn.onopen = function(e) { 
        conn.send(JSON.stringify({
        action: 'clients',
        method: 'add',
        data: {
          room: window.location.href,
          id: cookies.get('client_id')
        }
      }));
      conn.onclose = function(e) { 
          setIsConnected(false);
      };
      conn.send(JSON.stringify({
        action: 'clients',
        method: 'get',
        data: {
          room: window.location.href
        }
      }));
    };
  }, [window.location.href]);
  
  function showRole(){
    if(role === 'admin'){
      return (<h4 style={{color:'pink', padding: '10px', borderRadius: '10px'}}>Vous êtes administrateur de ce salon</h4>)
    }
  }
  function afterLoad(){
    if(role !== '' && clients !== '' && is_connected){
      return (<div className="App">
      <header className="App-header">
        {showRole()}
        <h2>Bienvenue dans le salon <code>{(Object.keys(clients).length !== 0 ) ? Object.keys(clients).length : '' }</code></h2>
        <p>Vous pouvez partager ce lien</p>
        <code>{window.location.href}</code>
        <br />
        <Link to="/">Retourner à l'accueil</Link>
      </header>
    </div>);
    }else if(role !== '' && clients !== ''){
      return (<div className="App">
      <header className="App-header">
        <p>Vous êtes déconnecté!</p>
        <p>{message}</p>
      </header>
    </div>);
    }
    return (<div className="App">
    <header className="App-header">
      <h2>Chargement...</h2>
    </header>
  </div>);
  }
  return afterLoad();
  
};

export default WaitingRoomPage;
