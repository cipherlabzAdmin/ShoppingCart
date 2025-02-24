import { Field } from 'formik';
import InputWrapper from '../../../Utils/HOC/InputWrapper';
import { ReactstrapInput } from '../../ReactstrapFormik';

const InputDateField = ({ name, ...rest }) => {
  return <Field type='date' name={name} id={name} {...rest} component={ReactstrapInput} />;
};
export default InputWrapper(InputDateField);