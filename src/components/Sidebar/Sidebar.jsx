import React from 'react';
import './Sidebar.css';
import { FaUserCircle, FaBars, FaListAlt, FaCog, FaTicketAlt } from 'react-icons/fa';

function Sidebar({ isOpen, setIsOpen }) {
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <FaUserCircle size={40} />
        <div className="user-info">
          <strong>Caio Ribeiro</strong>
          <span>caio@gmail.com</span>
        </div>
      </div>

      <ul className="sidebar-menu">
        <li>
          <FaListAlt /> <span>Histórico de pedidos</span>
        </li>
        <li>
          <FaCog /> <span>Configurações</span>
        </li>
        <li>
          <FaTicketAlt /> <span>Descontos</span>
        </li>
      </ul>
      <div className="sidebar-footer-toggle" onClick={toggleSidebar}>
          { !isOpen && <FaBars size={30} /> }
      </div>
    </div>
  );
}

export default Sidebar;