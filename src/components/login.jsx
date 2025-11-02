import React, { useState } from 'react';
import './login.css';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log('Dados do Login:', { email, password });
    alert('Login (fictício) enviado! Verifique o console.');
  };

  return (
    <div className="login-container">
      <h2>Faça seu Login</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Seu e-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Sua senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
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
      
      <p className="signup-link">
        Não possui conta? Faça seu <Link to="/cadastro">cadastro</Link>
    </p>
    </div>
  );
}

export default Login;