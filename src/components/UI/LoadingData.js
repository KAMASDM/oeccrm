import React from "react";

const LoadingData = ({ className }) => {
  return (
    <div className={className}>
      <div className="spinner-grow text-secondary align-self-center"></div>
    </div>
  );
};

export default LoadingData;
