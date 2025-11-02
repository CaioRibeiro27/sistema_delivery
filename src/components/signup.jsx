import React, { useState } from 'react';
import './signup.css';
import { Link } from 'react-router-dom';

function SignupForm() {
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
        <div className="input-group">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="telefone">Telefone</label>
          <input
            type="tel"
            id="telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="cpf">CPF</label>
          <input
            type="text"
            id="cpf"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </div>
        
        {/* O botão na sua imagem ainda diz "Entrar" */}
        <button type="submit" className="login-button">Entrar</button>
      </form>
      
      <div className="separator">ou</div>
      
      <div className="social-logins">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
          alt="Login com Google" 
          className="social-icon" 
        />
        <img 
          src="https://cdn.pixabay.com/photo/2021/06/15/12/51/facebook-6338508_1280.png" 
          alt="Login com Facebook" 
          className="social-icon" 
        />
      </div>
      
      {/* ❗️ PASSO 5 - Link para voltar ao Login */}
      <p className="login-link">
        Já possui conta? Fazer <Link to="/">login</Link>
      </p>
    </div>
  );
}

export default SignupForm;