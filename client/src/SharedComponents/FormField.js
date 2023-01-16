import React from 'react';

const FormField = ({ label, defaultValue, value, placeholder, onChange }) => {
  return (
    <div className='flex flex-col mt-2 mb-2 sm:flex-row sm:justify-between'>
      <label className="self-start text-sm text-white">
        {label}
      </label>
      <div className='flex flex-row pl-2 rounded-sm bg-chess-placeholder sm:w-64'>
        <input className="w-full text-white bg-transparent focus:outline-none focus:shadow-outline"
          defaultValue={defaultValue}
          value={value}
          placeholder={placeholder}
          type={label === "Age" ? "number" : "text"}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default FormField;