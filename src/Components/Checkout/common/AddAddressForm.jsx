import { useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Formik } from 'formik';
import I18NextContext from '@/Helper/I18NextContext';
import request from '@/Utils/AxiosUtils';
import { CountryAPI } from '@/Utils/AxiosUtils/API';
import { YupObject, nameSchema, phoneSchema } from '@/Utils/Validation/ValidationSchemas';
import { useTranslation } from '@/app/i18n/client';
import SelectForm from './SelectForm';
import { ToastNotification } from "../../../Utils/CustomFunctions/ToastNotification";
const baseUrl = process?.env?.API_BASE_URL;


const AddAddressForm = ({ mutate, type, editAddress, setEditAddress, modal, setModal, cId, setFetchAddress}) => {
  useEffect(() => { 
    modal !== 'edit' && setEditAddress && setEditAddress({});
  }, [modal]);
  const { data } = useQuery([CountryAPI], () => request({ url: CountryAPI }), {
    enabled: true,
    refetchOnWindowFocus: false,
    select: (res) => res.data.map((country) => ({ id: country.id, name: country.name, state: country.state })),
  });
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');

  async function AddAddress(data) {
    try {
      const response = await fetch(`${baseUrl}services/ecommerce/checkoutAddress/Create?checkoutId=1233`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([data]),
      });
  
      const result = await response.json();
      if(result.success){
        setModal(false);
        setFetchAddress(true);
        ToastNotification("success", "Added Address Successfully");
      }
    

    } catch (error) {
      console.log(error);
     
    }
  }

  return (
    
    <Formik
      initialValues={{
        addressLine1: editAddress ? editAddress?.addressLine1 : '',
        addressLine2: editAddress ? editAddress?.addressLine2 : '',
        city: editAddress ? editAddress?.city : '',
        pincode: editAddress ? editAddress?.pincode : '',
      }}
      validationSchema={YupObject({
        addressLine1: nameSchema,
        addressLine2: nameSchema,
        city: nameSchema,
        pincode: nameSchema,
      })}
      onSubmit={(values) => {
        if (modal) {
          values['_method'] = 'PUT';
        }
        values['pincode'] = values['pincode'].toString();
        const data =
          {
            "address1": values.addressLine1,
            "address2": values.addressLine2,
            "cityId": "00000000-0000-0000-0000-000000000000",
            "postalCode": values.pincode,
            "addressType": type == "billing" ? 1 : 2,
            "eCommerceCustomerId": cId
          }
        
        // mutate(values);

        AddAddress(data);
      }}>
      {({ values, setFieldValue }) => <SelectForm values={values} setFieldValue={setFieldValue} setModal={setModal} data={data} />}
    </Formik>
  );
};

export default AddAddressForm;
