import * as React from "react";
import { FormGroup, Input, Label } from "reactstrap";

const ReactstrapRadioInput = ({
  field,
  form: { isSubmitting, setFieldValue, touched, errors, values },
  index,
  disabled = false,
  ...props
}) => {
  return (
    <FormGroup check inline>
      <Label htmlFor={props.id}>
        <Input
          style={{
            width: '20px',
            height: '20px',
            border: touched[field.name] && errors[field.name] ? '2px solid red' : '2px solid gray',
          }}
          {...props}
          type="radio"
          name={field.name}
          checked={values[field.name] === field.value || index === 0}
          value={field.value}
          onChange={(event, value) => setFieldValue(field.name, field.value)}
        />
        {props.label}
      </Label>
    </FormGroup>
  );
};

export default ReactstrapRadioInput;
