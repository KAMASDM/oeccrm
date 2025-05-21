import React from "react";
import "./Button.css";

function Button(props) {
  const {
    divClassName = "button-container",
    btnClassName = "lavender-button",
    onClick,
    disabled,
    btnLabel,
    variant = "primary", // primary, secondary, outlined, text
    size = "medium", // small, medium, large
    startIcon = null,
    endIcon = null,
    fullWidth = false,
    loading = false
  } = props;

  const buttonClasses = [
    btnClassName,
    `lavender-button--${variant}`,
    `lavender-button--${size}`,
    fullWidth ? "lavender-button--fullwidth" : "",
    loading ? "lavender-button--loading" : "",
    disabled ? "lavender-button--disabled" : ""
  ].filter(Boolean).join(" ");

  return (
    <div className={divClassName}>
      <button
        className={buttonClasses}
        onClick={onClick}
        disabled={disabled || loading}
        type={props.type || "button"}
      >
        {loading && <span className="lavender-button__loader"></span>}
        {startIcon && <span className="lavender-button__icon lavender-button__icon--start">{startIcon}</span>}
        <span className="lavender-button__label">{btnLabel}</span>
        {endIcon && <span className="lavender-button__icon lavender-button__icon--end">{endIcon}</span>}
      </button>
    </div>
  );
}

export default Button;