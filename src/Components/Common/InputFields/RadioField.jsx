import { Field } from 'formik';
import InputWrapper from '../../../Utils/HOC/InputWrapper';
import { ReactstrapRadio } from '../../ReactstrapFormik';

const RadioField = ({ name, ...rest }) => {
  return <Field name={name} id={name} {...rest} component={ReactstrapRadio} />;
};
export default InputWrapper(RadioField);
