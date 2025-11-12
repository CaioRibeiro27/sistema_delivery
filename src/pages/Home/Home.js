import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import OrderHistory from "../../components/OrderHistory/OrderHistory";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const navigate = useNavigate();

  const handleMapClick = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="home-container">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onHistoryClick={() => setIsHistoryOpen(true)}
        onSettingsClick={() => navigate("/configuracoes")}
      />

      <div
        className={`map-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
        onClick={handleMapClick}
      ></div>

      {isHistoryOpen && (
        <OrderHistory onClose={() => setIsHistoryOpen(false)} />
      )}
    </div>
  );
}

export default Home;
