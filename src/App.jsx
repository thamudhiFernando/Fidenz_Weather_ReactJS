import logo from './logo.svg';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Dashboard from "./Dashboard";
import View_Weather from "./View_Weather";
import 'bootstrap/dist/css/bootstrap.min.css'
import weatherlogo from './assets/images/cloud_emoji.png';
import './App.css';
import './assets/style/style.css';
import React from "react";
import 'normalize.css';

function App() {
  return (
    /*<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>*/

      <BrowserRouter>
          <header>
              <img src={weatherlogo} alt="Weather App Icon" className="app-icon"></img>
              <h4 className="app-title">Weather App</h4>
          </header>

        <Routes>
          <Route path='/' element={<Dashboard />}></Route>
          <Route path='/View_Weather/:q' element={<View_Weather />}></Route>
        </Routes>

          <footer>
              <p>2023 Fidenz Technologies</p>
          </footer>
      </BrowserRouter>
  );
}

export default App;
