import InputField from './DateField';

const SimpleDateField = ({ nameList }) => {
  return (
    <>
      {nameList.map(({ name, ...rest }, i) => (
        <InputField name={name} {...rest} key={i} />
      ))}
    </>
  );
};

export default SimpleDateField;