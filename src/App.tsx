import React from 'react';
import './App.css';
import { Home } from './Components/Home';
import { Login } from './Components/Login';
import { Register } from './Components/Register';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { VideoRoom } from './Components/VideoRoom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/videoroom" element={<VideoRoom />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
