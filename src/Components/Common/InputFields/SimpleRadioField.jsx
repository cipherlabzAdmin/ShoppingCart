import InputField from './InputField';

const SimpleRadioField = ({ nameList }) => {
  return (
    <>
      {nameList.map(({ name, ...rest }, i) => (
        <InputField name={name} {...rest} key={i} />
      ))}
    </>
  );
};

export default SimpleRadioField;
