import React, { useEffect, useState } from "react";
import useUIStore from "../../store/uiStore";

const LoadingBar = () => {
  const isGlobalLoading = useUIStore((state) => state.isGlobalLoading);
  const [width, setWidth] = useState(0);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    let interval;
    if (isGlobalLoading) {
      setOpacity(1);
      // Simulate progress
      interval = setInterval(() => {
        setWidth((prev) => {
          if (prev < 90) return prev + Math.random() * 10;
          return prev;
        });
      }, 300);
    } else {
      // Complete bar
      setWidth(100);
      setTimeout(() => {
        setOpacity(0);
        setTimeout(() => setWidth(0), 400); // Reset for next use
      }, 500);
    }

    return () => clearInterval(interval);
  }, [isGlobalLoading]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "3px",
        backgroundColor: "#10b981", // AgroMart Green
        width: `${width}%`,
        opacity: opacity,
        transition: width === 100 ? "width 0.5s ease" : "width 0.3s ease, opacity 0.4s ease",
        zIndex: 9999,
        boxShadow: "0 0 10px rgba(16, 185, 129, 0.4)",
      }}
    />
  );
};

export default LoadingBar;
