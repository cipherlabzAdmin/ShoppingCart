import { useContext, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import { Input } from 'reactstrap';
import I18NextContext from '@/Helper/I18NextContext';
import { ForgotPasswordSchema } from '@/Utils/Hooks/Auth/useForgotPassword';
import { useTranslation } from '@/app/i18n/client';
import Btn from '@/Elements/Buttons/Btn';
import SearchableSelectInput from '@/Components/Common/InputFields/SearchableSelectInput';
import SimpleInputField from '@/Components/Common/InputFields/SimpleInputField';

const ComplainForm = () => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');
  
  return (
    <>
      <Formik
        initialValues={{
          order: '',
        }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={
          console.log("hi")
        }>
        {() => (
          <Form className='row g-2'>
             <SearchableSelectInput
          nameList={[
            {
              name: 'order',
              title: 'Order',
              toplabel: 'Order',
              placeholder: t("Order"),
              colprops: { xxl: 12, lg: 12, sm: 12 },
              inputprops: {
                name: 'order',
                id: 'order',
                options: [{"name":"option1"},{"name":"option2"},{"name":"option3"}],
                defaultOption: 'Select state',
              },
            },
            {
              name: 'reason',
              title: 'Reason',
              toplabel: 'Reason',
              colprops: { xxl: 12, lg: 12, sm: 12 },
              inputprops: {
                name: 'reason',
                id: 'reason',
                options: [{"name":"option1"},{"name":"option2"},{"name":"option3"}],
                defaultOption: 'Select state',
              },
            },
           
          ]}
        />

<SimpleInputField
                  nameList={[
                    {
                      name: "image",
                      type: "file",
                      title: "ImageUpload",
                      toplabel: "Image Upload",
                      colprops: { xxl: 12, lg: 12, sm: 12 },
                  
                    },
                    {
                      name: "description",
                      type: "textarea",
                      title: "Description",
                      toplabel: "Description",
                      colprops: { xxl: 12, lg: 12, sm: 12 },
                  
                    },
                  ]} />
            <Btn title={'Submit'} type='button' className="btn-animation mt-3 w-100"/>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ComplainForm;
