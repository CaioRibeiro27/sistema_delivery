import React, { useState } from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';
import InputGroup from '../../components/InputGroup/InputGroup';
import SocialLogin from '../../components/SocialLogin/SocialLogin';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Dados do Cadastro:', { name, email, password, telefone, cpf });
    alert('Cadastro (fictício) enviado! Verifique o console.');
  };

  return (
    <div className="signup-container">
      <h2>Faça seu cadastro</h2>

      <form onSubmit={handleSubmit}>
        <InputGroup
          label="Nome"
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <InputGroup
          label="Email"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputGroup
          label="Senha"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <InputGroup
          label="Telefone"
          type="tel"
          id="telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />

        <InputGroup
          label="CPF"
          type="text"
          id="cpf"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />

        <button type="submit" className="signup-button">Cadastrar</button>
      </form>

      <div className="separator">ou</div>

      <SocialLogin />

      <p className="login-link">
        Já possui conta? Fazer <Link to="/">login</Link>
      </p>
    </div>
  );
}

export default Signup;
