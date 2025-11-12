import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import {
  FaUserCircle,
  FaBars,
  FaListAlt,
  FaCog,
  FaTicketAlt,
} from "react-icons/fa";

function Sidebar({ isOpen, setIsOpen, onHistoryClick, onSettingsClick }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <FaUserCircle size={40} />
        <div className="user-info">
          <strong>{user ? user.nome : "Visitante"}</strong>
          <span>{user ? user.email : "..."}</span>
        </div>
      </div>

      <ul className="sidebar-menu">
        <li onClick={onHistoryClick}>
          <FaListAlt /> <span>Histórico de pedidos</span>
        </li>
        <li onClick={onSettingsClick}>
          <FaCog /> <span>Configurações</span>
        </li>
        <li>
          <FaTicketAlt /> <span>Descontos</span>
        </li>
      </ul>

      <div className="sidebar-footer-toggle" onClick={toggleSidebar}>
        {!isOpen && <FaBars size={30} />}
      </div>
    </div>
  );
}

export default Sidebar;
