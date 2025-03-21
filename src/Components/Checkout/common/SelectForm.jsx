import SearchableSelectInput from '@/Components/Common/InputFields/SearchableSelectInput';
import SimpleInputField from '@/Components/Common/InputFields/SimpleInputField';
import { Form } from 'formik';
import { ModalFooter, Row } from 'reactstrap';
import { AllCountryCode } from '../../../../Data/AllCountryCode';
import Btn from '@/Elements/Buttons/Btn';
import { useContext } from 'react';
import I18NextContext from '@/Helper/I18NextContext';
import { useTranslation } from '@/app/i18n/client';

const SelectForm = ({ values, data, setModal }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');
  return (
    <Form>
      <Row>
        <SimpleInputField
          nameList={[
            { name: 'addressLine1', placeholder: t('EnterAddressLine2'), toplabel: 'AddressLine1', colprops: { xs: 6 }, require: 'true' },
            { name: 'addressLine2', placeholder: t('EnterAddressLine1'), toplabel: 'AddressLine2', colprops: { xs: 6 }, require: 'true' },
          ]}
        />

        <SimpleInputField
          nameList={[
            { name: 'city', placeholder: t('EnterCity'), toplabel: 'City', colprops: { xxl: 6, lg: 12, sm: 6 }, require: 'true' },
            { name: 'pincode', placeholder: t('EnterPincode'), toplabel: 'Pincode', colprops: { xxl: 6, lg: 12, sm: 6 }, require: 'true' },
          ]}
        />
     
        <ModalFooter className='ms-auto justify-content-end save-back-button'>
          <Btn className='btn-md btn-theme-outline fw-bold' title='Cancel' onClick={() => setModal(false)} />
          <Btn className='btn-md fw-bold text-light theme-bg-color' type='submit' title='Submit' />
        </ModalFooter>
      </Row>
    </Form>
  );
};

export default SelectForm;
