import React from 'react';
import './OrderHistory.css';
import { FaArrowLeft } from 'react-icons/fa';

function OrderHistory({ onClose }) {
  return (
    <div className="history-overlay">
      <div className="history-container">
        <h2>Historico de pedidos</h2>
        
        <div className="order-list">
          <div className="order-item">
            Pedido do dia 20/10/2025 (em andamento)
          </div>
          <div className="order-item">
            Pedido do dia 18/10/2025
          </div>
        </div>
      </div>
      <div className="back-arrow" onClick={onClose}>
        <FaArrowLeft size={30} />
      </div>

    </div>
  );
}

export default OrderHistory;