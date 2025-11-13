import React, { useState, useEffect } from "react";
import "./Settings.css";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaArrowLeft } from "react-icons/fa";

import GeneralSettings from "../../components/GeneralSettings/GeneralSettings";
import PaymentSettings from "../../components/PaymentSettings/PaymentSettings";

function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("gerais");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "gerais":
        return (
          <GeneralSettings
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        );
      case "pagamentos":
        if (!user) {
          return <div>Carregando informações do usuário...</div>;
        }
        return <PaymentSettings userId={user.id} />;

      case "perfil":
        return <div>Em breve: Perfil</div>;
      default:
        return (
          <GeneralSettings
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        );
    }
  };

  return (
    <div className={`settings-page ${isDarkMode ? "dark-mode" : ""}`}>
      {" "}
      <nav className="settings-sidebar">
        <h3>Configurações</h3>{" "}
        <div className="settings-user-profile">
          <FaUserCircle size={24} />{" "}
          <strong>{user ? user.nome : "Carregando..."}</strong>{" "}
        </div>
        <ul className="settings-menu">
          <li
            className={activeTab === "gerais" ? "active" : ""}
            onClick={() => setActiveTab("gerais")}
          >
            Configurações gerais
          </li>
          <li
            className={activeTab === "pagamentos" ? "active" : ""}
            onClick={() => setActiveTab("pagamentos")}
          >
            Formas de pagamentos
          </li>
          <li
            className={activeTab === "perfil" ? "active" : ""}
            onClick={() => setActiveTab("perfil")}
          >
            Perfil
          </li>
        </ul>
        <div className="settings-back-arrow" onClick={() => navigate("/home")}>
          <FaArrowLeft size={20} />
        </div>
      </nav>{" "}
      <main className="settings-content">{renderActiveTabContent()}</main>
    </div>
  );
}

export default Settings;
