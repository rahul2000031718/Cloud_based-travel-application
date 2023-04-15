import React, { Component,Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import PrivateRoute from './components/PrivateRoute';
import Home from './components/Home';
import { Auth } from 'aws-amplify';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Route,Link, Routes, Router} from 'react-router-dom';
import AWSLogin from './components/AWSLogin';
import FBLogin from './components/FBLogin';
import GLogin from './components/GLogin';
import { Card} from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <React.Fragment>
  
        <Card bg={'Dark'.toLowerCase()} text={'white'}>
            <Card.Body><Card.Body>
              <h3>Travel O Cloud</h3>
              <div className="col d-flex justify-content-center">
              <Link to="/FBLogin">Facebook</Link>&nbsp;&nbsp;&nbsp;
              <Link to="/GLogin">Google</Link> &nbsp;&nbsp;&nbsp;
              <Link to="/login">Login</Link> &nbsp;&nbsp;&nbsp;
              </div>  
            </Card.Body></Card.Body>
        </Card>

        <div className="App-intro">
          <Routes>
            <Route exact path="/FBLogin"  element={<FBLogin/>} ></Route>
            <Route path="/GLogin" element={<GLogin/>} ></Route>
            <Route path="/login" element={<AWSLogin/>} ></Route>
            <Route path="/home" element={<Home/>} ></Route>
          </Routes>
        </div>
   
      </React.Fragment> 
    );
  }
}

export default App;
