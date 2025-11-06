import React from 'react';
import './InputGroup.css';

function InputGroup({ label, type, id, value, onChange }) {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}

export default InputGroup;
