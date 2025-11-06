import React from 'react';
import './SocialLogin.css';

function SocialLogin() {
  return (
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
  );
}

export default SocialLogin;
