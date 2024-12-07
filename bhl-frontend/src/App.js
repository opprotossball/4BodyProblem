import './App.css';
import {HomePage} from "./pages/HomePage";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Simulation from './Simulation';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src="./logo.svg" className="App-logo" alt="logo" />
          <p>Welcome to the Earth-Mars Communication Simulator!</p>
          <Link to="/simulation" className="App-link">
            Przejdź do Symulacji
          </Link>
        </header>
        <Routes>
          <Route path="/simulation" element={<Simulation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;