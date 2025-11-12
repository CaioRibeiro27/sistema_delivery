import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
import Settings from "./pages/Settings/Settings";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/configuracoes" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
