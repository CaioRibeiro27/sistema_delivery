import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
import Settings from "./pages/Settings/Settings";
import Selection from "./pages/Selection/Selection";
import RestaurantSignup from "./pages/RestaurantSignup/RestaurantSignup";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import RestaurantDashboard from "./pages/RestaurantDashboard/RestaurantDashboard";

function App() {
  return (
    <div className="App">
      <Routes>
        {/*Rotas Públicas*/}
        <Route path="/" element={<Login />} />
        <Route path="/selecao" element={<Selection />} />
        <Route path="/cadastro" element={<Signup />} />
        <Route path="/cadastro-restaurante" element={<RestaurantSignup />} />
        {/*Rotas Protegidas*/}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracoes"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard-restaurante"
          element={
            <ProtectedRoute>
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
