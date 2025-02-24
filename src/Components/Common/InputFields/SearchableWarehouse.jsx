import SelectField from './SelectFieldWarehouse';

const SearchableWarehouse = ({ nameList }) => {
  return (
    <>
      {nameList.map(({ name, ...rest }, i) => (
        <SelectField name={name} {...rest} key={i} />
      ))}
    </>
  );
};

export default SearchableWarehouse;
