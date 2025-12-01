import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Componentes de Segurança
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// Páginas Públicas
import Login from "./pages/Login/Login";
import Selection from "./pages/Selection/Selection";
import Signup from "./pages/Signup/Signup"; // Cadastro Usuário
import RestaurantSignup from "./pages/RestaurantSignup/RestaurantSignup";

// Páginas do USUÁRIO
import Home from "./pages/Home/Home";
import Settings from "./pages/Settings/Settings";

// Páginas do RESTAURANTE
import RestaurantDashboard from "./pages/RestaurantDashboard/RestaurantDashboard";
import RestaurantMenu from "./pages/RestaurantMenu/RestaurantMenu";
import RestaurantSettings from "./pages/RestaurantSettings/RestaurantSettings";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* ROTAS PÚBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/selecao" element={<Selection />} />
        <Route path="/cadastro" element={<Signup />} />
        <Route path="/cadastro-restaurante" element={<RestaurantSignup />} />

        {/* ROTAS PROTEGIDAS (USUÁRIO) */}
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

        {/* ROTAS PROTEGIDAS (RESTAURANTE) */}
        <Route
          path="/dashboard-restaurante"
          element={
            <ProtectedRoute>
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cardapio-restaurante"
          element={
            <ProtectedRoute>
              <RestaurantMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracoes-restaurante"
          element={
            <ProtectedRoute>
              <RestaurantSettings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
