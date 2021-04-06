import React, { Component } from "react";
import './App.css';

import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import MainPage from "./pages/index";
import Page404 from "./pages/404";
import WaitingRoomPage from "./pages/waiting_room";


class App extends Component {
  render(){
    return <Router>
      {/* Multiple routes with switch */}
      <Switch>
        {/* Exact is important */}
        <Route exact path="/" component={MainPage}/>
        <Route path="/room/" component={WaitingRoomPage}/>
        {/* If not over routes match*/}
        <Route exact path="/404" component={Page404}/>
        <Redirect to="/404" />
      </Switch>
    </Router>;
  }
}

export default App;
