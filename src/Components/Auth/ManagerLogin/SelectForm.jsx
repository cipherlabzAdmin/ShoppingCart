import SearchableSelectInput from '@/Components/Common/InputFields/SearchableSelectInput';
import SimpleInputField from '@/Components/Common/InputFields/SimpleInputField';
import { Form } from 'formik';
import { ModalFooter, Row } from 'reactstrap';
import { AllCountryCode } from '../../../../Data/AllCountryCode';
import Btn from '@/Elements/Buttons/Btn';
import { useContext } from 'react';
import I18NextContext from '@/Helper/I18NextContext';
import { useTranslation } from '@/app/i18n/client';

const SelectForm = ({ values, setModal }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');
  return (
    <Form>
      <Row>
        <SimpleInputField
          nameList={[
            { name: 'NIC', placeholder: t('NIC'), colprops: { xs: 12 } },
           
          ]}
        />

     
        <ModalFooter className='justify-content-center save-back-button'>
        <Btn className='btn-md fw-bold text-light theme-bg-color' type='submit' title='Load' />
        <Btn className='btn-md fw-bold text-light theme-bg-color' type='submit' title='Shopping' />
          <Btn className='btn-md btn-theme-outline fw-bold' title='Cancel' onClick={() => setModal(false)} />
          
        </ModalFooter>
      </Row>
    </Form>
  );
};

export default SelectForm;
