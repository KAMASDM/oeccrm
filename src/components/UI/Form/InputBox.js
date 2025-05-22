import React from "react";

const InputBox = ({
  reducerName,
  onChange,
  divClassName,
  label,
  value,
  type,
  required,
}) => {
  const inputChangeHandler = function (e) {
    onChange({ type: reducerName, value: e.target.value });
  };
  
  return (
    <div className={divClassName}>
      <label className="form-label">{label}</label>
      <input
        type={type}
        className="form-control"
        required={required ? true : false}
        onChange={inputChangeHandler}
        value={value}
      />
    </div>
  );
};

export default InputBox;
