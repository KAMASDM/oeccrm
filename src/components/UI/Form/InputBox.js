import React, { useState } from "react";
import "./InputBox.css";

function InputBox(props) {
  const [focused, setFocused] = useState(false);
  
  const {
    divClassName = "lavender-input-container",
    label,
    type = "text",
    required = false,
    onChange,
    value,
    reducerName,
    placeholder,
    helperText,
    error,
    icon,
    disabled = false,
    autoComplete,
    min,
    max,
    pattern
  } = props;

  const inputChangeHandler = function (e) {
    onChange({ type: reducerName, value: e.target.value });
  };

  // Determine if the input has a value for styling
  const hasValue = value !== undefined && value !== null && value !== "";
  
  // Generate CSS classes
  const containerClasses = [
    divClassName,
    focused ? "is-focused" : "",
    hasValue ? "has-value" : "",
    error ? "has-error" : "",
    disabled ? "is-disabled" : ""
  ].filter(Boolean).join(" ");

  return (
    <div className={containerClasses}>
      {label && (
        <label className="lavender-input-label">
          {label}
          {required && <span className="lavender-input-required">*</span>}
        </label>
      )}
      
      <div className="lavender-input-field-container">
        {icon && <div className="lavender-input-icon">{icon}</div>}
        
        <input
          type={type}
          className="lavender-input-field"
          required={required}
          onChange={inputChangeHandler}
          value={value || ""}
          placeholder={placeholder || ""}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          autoComplete={autoComplete}
          min={min}
          max={max}
          pattern={pattern}
        />
      </div>
      
      {helperText && (
        <div className={`lavender-input-helper-text ${error ? "error" : ""}`}>
          {helperText}
        </div>
      )}
    </div>
  );
}

export default InputBox;