import React, { useState, useEffect } from "react";
import "./ProfileSettings.css";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ProfileSettings({ userId }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}`);
      const data = await response.json();
      if (data.success) setUserData(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const maskPhone = (phone) => {
    if (!phone) return "";
    return `(${phone.substring(0, 2)}) 9****-****`;
  };

  const maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    return `${name.substring(0, 1)}***@${domain}`;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    let body = {};

    if (modalType === "telefone") body = { telefone: inputValue };
    if (modalType === "senha") body = { novaSenha: inputValue };

    try {
      const response = await fetch(
        `http://localhost:3001/api/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();

      if (data.success) {
        alert("Atualizado com sucesso!");
        setModalType(null);
        setInputValue("");
        fetchUserData();
      } else {
        alert("Erro: " + data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "ATENÇÃO: Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita."
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/users/${userId}`,
          { method: "DELETE" }
        );
        if (response.ok) {
          alert("Conta excluída.");
          localStorage.removeItem("user");
          navigate("/");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!userData) return <div>Carregando perfil...</div>;

  return (
    <div className="profile-content">
      <h2>Perfil</h2>
      <div className="profile-header-card">
        <div className="profile-picture-section static">
          <FaUserCircle size={80} />
        </div>
        <div className="profile-info-text">
          <p>
            <strong>Nome:</strong> {userData.nome.split(" ")[0]}
          </p>
        </div>
      </div>

      <div className="profile-options-list">
        {/* Linha Telefone (Editável)*/}
        <div className="profile-option-row">
          <span>Telefone: {maskPhone(userData.telefone)}</span>
          <button
            className="btn-alterar"
            onClick={() => setModalType("telefone")}
          >
            Alterar
          </button>
        </div>

        {/* Linha Email (Apenas leitura) */}
        <div className="profile-option-row">
          <span>E-mail: {maskEmail(userData.email)}</span>
        </div>

        {/* Linha Senha (Editável) */}
        <div className="profile-option-row">
          <span>Alterar senha</span>
          <button className="btn-alterar" onClick={() => setModalType("senha")}>
            Alterar
          </button>
        </div>

        {/* Linha Excluir */}
        <div className="profile-option-row delete-row">
          <button className="btn-excluir-conta" onClick={handleDeleteAccount}>
            Excluir conta
          </button>
        </div>
      </div>

      {modalType && (
        <div className="modal-overlay">
          <form className="modal-form" onSubmit={handleUpdate}>
            <h3>Editar {modalType}</h3>
            {modalType === "telefone" && (
              <div className="form-group">
                <label>Telefone atual</label>
                <input
                  type="text"
                  value={userData.telefone}
                  disabled
                  className="input-disabled"
                />
              </div>
            )}

            <div className="form-group">
              <label>Novo {modalType}</label>
              <input
                type={modalType === "senha" ? "password" : "text"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
                placeholder={modalType === "senha" ? "Digite a nova senha" : ""}
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-avancar">
                Avançar
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => {
                  setModalType(null);
                  setInputValue("");
                }}
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

export default ProfileSettings;
