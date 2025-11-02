import React from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";

import LoginForm from "./components/login";
import SignupForm from "./components/signup";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/cadastro" element={<SignupForm />} />
      </Routes>
    </div>
  );
}

export default App;
