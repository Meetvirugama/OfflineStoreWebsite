import React from "react";
import "@/styles/loader.css";

const AgroLoader = ({ size = "large", text = "Loading AgroMart..." }) => {
  return (
    <div className="agro-loader-wrap">
      <div className={`agro-loader-spinner ${size === 'small' ? 'small' : ''}`}>
        <div className="agro-loader-ring"></div>
        <div className="agro-loader-segment"></div>
        <div className="agro-loader-pulse"></div>
      </div>
      {text && (
        <p className="agro-loader-text">
          {text}
        </p>
      )}
    </div>
  );
};

export default AgroLoader;
