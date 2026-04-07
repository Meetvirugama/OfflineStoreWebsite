import React from "react";
import "./GoogleLoginButton.css";

const GoogleLoginButton = () => {
  const handleClick = () => {
    // Exact URL based on backend route implementation
    window.location.href = "http://localhost:5001/api/auth/google";
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
