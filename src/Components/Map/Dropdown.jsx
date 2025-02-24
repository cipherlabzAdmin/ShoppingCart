import React from "react";

const Dropdown = ({ field, form, options, label, ...props }) => (
  <div className={"inputGroup col-6"}>
    <label>{label}</label>
    <select
      {...field}
      onChange={(e) => {
        field.onChange(e);
        if (props.onChange) props.onChange(e);
      }}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.id} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {form.touched[field.name] && form.errors[field.name] && (
      <div className="error" style={{ color: "red" }}>
        {form.errors[field.name]}
      </div>
    )}
  </div>
);

export default Dropdown;
