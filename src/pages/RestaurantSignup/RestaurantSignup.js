import React, { useState } from "react";
import "./RestaurantSignup.css";
import InputGroup from "../../components/InputGroup/InputGroup";
import { Link, useNavigate } from "react-router-dom";

function RestaurantSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Controla qual tela aparece
  // Estado único para TUDO
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    cnpj: "",
    estado: "",
    cidade: "",
    cep: "",
    bairro: "",
    rua: "",
    numero: "",
  });

  // Atualiza os dados
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Envia tudo para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3001/api/register-restaurant",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Restaurante cadastrado!");
        navigate("/"); // Vai para o login
      } else {
        alert("Erro: " + data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="signup-container">
      {step === 1 && (
        <>
          <h2>Cadastre seu restaurante</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(2);
            }}
          >
            <InputGroup
              label="Nome do estabelecimento"
              type="text"
              id="nome"
              value={formData.nome}
              onChange={handleChange}
            />
            <InputGroup
              label="Email"
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputGroup
              label="Senha"
              type="password"
              id="senha"
              value={formData.senha}
              onChange={handleChange}
            />
            <InputGroup
              label="Telefone"
              type="tel"
              id="telefone"
              value={formData.telefone}
              onChange={handleChange}
            />
            <InputGroup
              label="CNPJ"
              type="text"
              id="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
            />

            <button type="submit" className="login-button">
              Próximo
            </button>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <h2>Cadastre seu restaurante</h2>
          <form onSubmit={handleSubmit}>
            <InputGroup
              label="Estado"
              type="text"
              id="estado"
              value={formData.estado}
              onChange={handleChange}
            />
            <InputGroup
              label="Cidade"
              type="text"
              id="cidade"
              value={formData.cidade}
              onChange={handleChange}
            />
            <InputGroup
              label="CEP"
              type="text"
              id="cep"
              value={formData.cep}
              onChange={handleChange}
            />
            <InputGroup
              label="Bairro"
              type="text"
              id="bairro"
              value={formData.bairro}
              onChange={handleChange}
            />
            <InputGroup
              label="Rua"
              type="text"
              id="rua"
              value={formData.rua}
              onChange={handleChange}
            />
            <InputGroup
              label="Numero"
              type="number"
              id="numero"
              value={formData.numero}
              onChange={handleChange}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="login-button"
                style={{ backgroundColor: "#ccc" }}
                onClick={() => setStep(1)}
              >
                Voltar
              </button>
              <button type="submit" className="login-button">
                Entrar
              </button>
            </div>
          </form>
        </>
      )}

      <p className="login-link">
        Já possui conta? Fazer <Link to="/">login</Link>
      </p>
    </div>
  );
}

export default RestaurantSignup;
