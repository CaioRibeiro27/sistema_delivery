import React, { useState, useEffect } from "react";
import "./ClientMenu.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";

function ClientMenu() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchRestaurantInfo();
    fetchMenu();
  }, [id]);

  const fetchRestaurantInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/restaurants/${id}`
      );
      const data = await response.json();
      if (data.success) setRestaurant(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/menu/${id}`);
      const data = await response.json();
      if (data.success) setMenuItems(data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const renderCategory = (title, categoryDB) => {
    const items = menuItems.filter((item) => item.categoria === categoryDB);

    if (items.length === 0) return null;

    return (
      <div className="client-menu-section">
        <h3>{title}</h3>
        <div className="client-items-list">
          {items.map((item) => (
            <div key={item.id_cardapio} className="client-menu-item">
              <div className="item-header">
                <span className="item-name">{item.nome_produto}</span>
                <span className="item-dots"></span>{" "}
                {/* O truque dos pontinhos */}
                <span className="item-price">
                  R$ {item.preco.replace(".", ",")}
                </span>
              </div>
              <p className="item-desc">({item.descricao})</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="client-menu-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div
        className={`client-menu-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
        onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
      >
        <div className="paper-card">
          <div className="paper-header">
            <h2>{restaurant ? restaurant.nome : "Carregando..."}</h2>
          </div>

          <div className="paper-body">
            {renderCategory("PRATO PRINCIPAL", "Refeicoes")}
            {renderCategory("BEBIDAS", "Bebidas")}
            {renderCategory("APERITIVOS", "Aperitivos")}
          </div>

          <div className="paper-footer" onClick={() => navigate("/home")}>
            <FaArrowLeft size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientMenu;
