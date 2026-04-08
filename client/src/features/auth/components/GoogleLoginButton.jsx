import React from "react";
import "./GoogleLoginButton.css";

const GoogleLoginButton = () => {
  const handleClick = () => {
    const apiBase = import.meta.env.VITE_API_URL;

    window.location.href = `${apiBase}/auth/google`;
  };

  return (
    <button 
      id="google-auth-btn"
      type="button" 
      className="google-login-btn" 
      onClick={handleClick}
    >
      <img 
        src="https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" 
        alt="Google" 
        className="google-icon" 
        loading="lazy"
      />
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;
