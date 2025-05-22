import React from "react";

const Button = ({
  divClassName,
  btnClassName,
  onClick,
  disabled,
  btnLabel,
}) => {
  return (
    <div className={divClassName}>
      <button className={btnClassName} onClick={onClick} disabled={disabled}>
        {btnLabel}
      </button>
    </div>
  );
};

export default Button;
