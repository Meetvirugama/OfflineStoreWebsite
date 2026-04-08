import React from "react";

const AgroLoader = ({ size = "large", text = "Loading AgroMart..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className={`relative ${size === 'large' ? 'w-16 h-16' : 'w-8 h-8'}`}>
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
        {/* Spinning Segment */}
        <div className="absolute inset-0 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin"></div>
        {/* Center icon / Nature pulse */}
        <div className="absolute inset-4 bg-emerald-500 rounded-full animate-pulse opacity-20"></div>
      </div>
      {text && (
        <p className="text-emerald-800 font-bold animate-pulse text-sm uppercase tracking-widest">
          {text}
        </p>
      )}
    </div>
  );
};

export default AgroLoader;
