import React, { useState, useEffect } from "react";
import "./PaymentSettings.css";
import { FaPlus, FaCreditCard } from "react-icons/fa";

function PaymentSettings({ userId }) {
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numeroCartao, setNumeroCartao] = useState("");
  const [nomeTitular, setNomeTitular] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");

  const fetchCards = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:3001/api/cards/${userId}`);
      const data = await response.json();
      if (data.success) {
        setCards(data.cards);
      }
    } catch (error) {
      console.error("Erro ao buscar cartões:", error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [userId]);

  const handleAddCard = async (e) => {
    e.preventDefault();

    const cardData = {
      numero_cartao: numeroCartao,
      bandeira: "Visa",
      nome_titular: nomeTitular,
      data_vencimento: dataVencimento,
      id_usuario: userId,
    };

    try {
      const response = await fetch("http://localhost:3001/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Cartão adicionado!");
        setIsModalOpen(false);
        fetchCards();
        setNumeroCartao("");
        setNomeTitular("");
        setDataVencimento("");
      } else {
        alert("Erro ao adicionar cartão: " + data.message);
      }
    } catch (error) {
      console.error("Erro ao salvar cartão:", error);
    }
  };

  return (
    <div className="payment-content">
      <h2>Formas de pagamento</h2>
      <p className="saldo-conta">Saldo em conta: ----</p>
      <div className="card-list">
        {cards.map((card) => (
          <div className="card-item" key={card.id_cartao}>
            <div className="card-icon">
              <FaCreditCard size={28} />
            </div>

            <div className="card-details">
              <strong>{card.bandeira}</strong>
              <span>
                Cartão de crédito terminado com ****{" "}
                {card.numero_cartao.slice(-4)}
              </span>
            </div>

            <a href="#" className="card-edit-link">
              Editar
            </a>
          </div>
        ))}
      </div>

      <div
        className="card-item add-payment-row"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="card-icon">
          <FaPlus size={24} />
        </div>

        <div className="card-details"></div>

        <a
          href="#"
          className="card-edit-link"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          Adicionar pagamento
        </a>
      </div>

      {isModalOpen && (
        <div className="add-card-modal-overlay">
          <form className="add-card-modal-form" onSubmit={handleAddCard}>
            <h3>Adicionar pagamento</h3>

            <div className="form-group">
              <label htmlFor="vencimento">Data vencimento</label>
              <input
                type="text"
                id="vencimento"
                placeholder="MM/AA"
                value={dataVencimento}
                onChange={(e) => setDataVencimento(e.target.value)}
                required
                maxLength="5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="nome">Nome titular</label>
              <input
                type="text"
                id="nome"
                value={nomeTitular}
                onChange={(e) => setNomeTitular(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="numero">Numero cartão</label>
              <input
                type="text"
                id="numero"
                placeholder="**** **** **** ****"
                value={numeroCartao}
                onChange={(e) => setNumeroCartao(e.target.value)}
                required
                maxLength="16"
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-avancar">
                Avançar
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default PaymentSettings;
