import { Field } from 'formik';
import InputWrapper from '@/Utils/HOC/InputWrapper';
import { ReactstrapWarehouse } from '@/Components/ReactstrapFormik';

const SelectFieldWarehouse = ({ name, ...rest }) => {
  return <Field type='text' name={name} id={name} component={ReactstrapWarehouse} {...rest} />;
};

export default InputWrapper(SelectFieldWarehouse);
