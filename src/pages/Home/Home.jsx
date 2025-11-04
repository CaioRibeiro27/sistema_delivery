import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar'; 
import './Home.css';

function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const handleMapClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div className="home-container">
      <Sidebar 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
      />
      <div 
        className={`map-content ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        onClick={handleMapClick}
      >
      </div>
    </div>
  );
}

export default Home;