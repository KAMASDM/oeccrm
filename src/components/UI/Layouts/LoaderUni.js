import React from "react";
import "../../../assets/css/LoaderUni.css";
function LoaderUni() {
  return (
    <div className="loaderMain">
      <div className="cardLoader">
        <div className="boxLoader">
          <div className="percentLoader">
            <svg>
              <circle cx="70" cy="70" r="70"></circle>
              <circle cx="70" cy="70" r="70"></circle>
            </svg>
            <div className="numberLoader">
              <h2>
                90<span>%</span>
              </h2>
            </div>
            <h3>HTML</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoaderUni;
