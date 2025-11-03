import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
