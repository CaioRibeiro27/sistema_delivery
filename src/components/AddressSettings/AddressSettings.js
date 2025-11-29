import React, { useState, useEffect } from "react";
import "./AddressSettings.css";
import { FaPlus, FaMapMarkerAlt } from "react-icons/fa";

function AddressSettings({ userId }) {
  const [addresses, setAddresses] = useState([]);

  // Controle de Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Campos do Formulário
  const [cidade, setCidade] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [cep, setCep] = useState("");
  const [bairro, setBairro] = useState("");
  const [localizacao, setLocalizacao] = useState(""); // Ex: Casa, Trabalho

  // Buscar endereços
  const fetchAddresses = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/addresses/${userId}`
      );
      const data = await response.json();
      if (data.success) setAddresses(data.addresses);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  // Abrir modal para ADICIONAR
  const openAddModal = () => {
    setIsEditMode(false);
    setCidade("");
    setRua("");
    setNumero("");
    setCep("");
    setBairro("");
    setLocalizacao("");
    setIsModalOpen(true);
  };

  // Abrir modal para EDITAR
  const openEditModal = (addr) => {
    setIsEditMode(true);
    setSelectedAddressId(addr.id_endereco);
    setCidade(addr.cidade);
    setRua(addr.rua);
    setNumero(addr.numero);
    setCep(addr.cep);
    setBairro(addr.bairro);
    setLocalizacao(addr.localizacao);
    setIsModalOpen(true);
  };

  // Salvar (Criar ou Atualizar)
  const handleSave = async (e) => {
    e.preventDefault();
    const body = {
      cidade,
      rua,
      numero,
      cep,
      bairro,
      localizacao,
      id_usuario: userId,
    };

    const url = isEditMode
      ? `http://localhost:3001/api/addresses/${selectedAddressId}`
      : `http://localhost:3001/api/addresses`;

    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.success) {
        alert(isEditMode ? "Endereço atualizado!" : "Endereço adicionado!");
        setIsModalOpen(false);
        fetchAddresses();
      } else {
        alert("Erro: " + data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Deletar
  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja remover este endereço?")) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/addresses/${selectedAddressId}`,
          { method: "DELETE" }
        );
        const data = await response.json();
        if (data.success) {
          alert("Endereço removido!");
          setIsModalOpen(false);
          fetchAddresses();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="address-content">
      <h2>Gerenciar endereços</h2>

      <div className="address-list">
        {addresses.map((addr) => (
          <div
            className="address-item"
            key={addr.id_endereco}
            onClick={() => openEditModal(addr)}
          >
            <div className="address-icon">
              <FaMapMarkerAlt size={24} />
            </div>
            <div className="address-details">
              <strong>{addr.localizacao}</strong>
            </div>
            <span className="address-edit-link">Alterar endereço</span>
          </div>
        ))}

        {/* Botão Adicionar */}
        <div className="address-item add-address-row" onClick={openAddModal}>
          <div className="address-icon">
            <FaPlus size={24} />
          </div>
          <div className="address-details"></div>
          <span className="address-edit-link">Adicionar endereço</span>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="address-modal-overlay">
          <form className="address-modal-form" onSubmit={handleSave}>
            <h3>{isEditMode ? "Alterar endereço" : "Adicionar endereço"}</h3>

            <div className="form-group">
              <label>Cidade</label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Rua</label>
              <input
                type="text"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Numero</label>
              <input
                type="number"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>CEP</label>
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Bairro</label>
              <input
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Localização (Nome)</label>
              <input
                type="text"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                placeholder="Ex: Casa, Trabalho"
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-avancar">
                Avançar
              </button>
              {isEditMode ? (
                <button
                  type="button"
                  className="btn-remover"
                  onClick={handleDelete}
                >
                  Remover
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AddressSettings;
