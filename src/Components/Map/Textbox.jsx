import React from "react";

const TextField = ({ field, form, label, placeholder, className, ...props }) => (
  <div className={"inputGroup col-6"}>
    <label>{label}</label>
    <input type="text" {...field} placeholder={placeholder ? placeholder : `Enter ${label}`} onChange={(e) => {
      field.onChange(e);
      if (props.onChange) props.onChange(e);
    }} className={className} />
    {form.touched[field.name] && form.errors[field.name] && (
      <div className="error" style={{ color: "red" }}>
        <small>{form.errors[field.name]}</small>
      </div>
    )}
  </div>
);

export default TextField;