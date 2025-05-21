import React from "react";
import { Spinner } from "react-bootstrap";

function LoadingData(props) {
  return (
    <div className={props.className}>
      <div className="spinner-grow text-secondary align-self-center"></div>
    </div>
  );
}

export default LoadingData;
