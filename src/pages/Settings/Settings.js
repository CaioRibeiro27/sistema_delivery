import React, { useState, useEffect } from "react";
import "./Settings.css";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaArrowLeft,
  FaVolumeUp,
  FaVolumeDown,
  FaVolumeMute,
  FaVolumeOff,
} from "react-icons/fa";

function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      console.warn("Nenhum usuário logado, redirecionando...");
    }
  }, []);

  return (
    <div className="settings-page">
      <nav className="settings-sidebar">
        <h3>Configurações</h3>

        <div className="settings-user-profile">
          <FaUserCircle size={24} />
          <strong>{user ? user.nome : "Carregando..."}</strong>
        </div>

        <ul className="settings-menu">
          <li className="active">Configurações gerais</li>
          <li>Formas de pagamentos</li>
          <li>Perfil</li>
        </ul>

        <div className="settings-back-arrow" onClick={() => navigate("/home")}>
          <FaArrowLeft size={20} />
        </div>
      </nav>
      <main className="settings-content">
        <h2>Tela e som</h2>
        <div className="setting-row">
          <span>Tema</span>
          <div className="theme-toggle">
            <button className="theme-btn active">Claro</button>
            <button className="theme-btn">Escuro</button>
          </div>
        </div>

        <div className="setting-row">
          <span>Notificação</span>
          <div className="volume-controls">
            <FaVolumeOff size={20} />
            <FaVolumeMute size={20} />
            <FaVolumeDown size={20} />
            <FaVolumeUp size={20} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
