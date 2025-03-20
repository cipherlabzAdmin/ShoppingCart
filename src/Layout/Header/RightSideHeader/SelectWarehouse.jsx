import React, { useContext, useEffect } from 'react';
import SearchableSelectInput from '@/Components/Common/InputFields/SearchableWarehouse';
import Btn from '@/Elements/Buttons/Btn';
import { Form } from 'formik';
import { Row, Col } from 'reactstrap';
import { Formik } from 'formik';
import { useQuery } from '@tanstack/react-query';
import { CountryAPI } from '@/Utils/AxiosUtils/API';
import CustomerContext from '@/Helper/CustomerContext';
const baseUrl = process?.env?.API_BASE_URL;

const SelectWarehouse = ({closeModal}) => {
    const { warehouses, setWarehouseSelect } = useContext(CustomerContext);
  
      async function GetWarehouse(data, closeModal) {
        try {
          const response = await fetch(`${baseUrl}services/app/warehouse/Get`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "id": data.warehouse_id
            }),
          });
      
          const result = await response.json();
          if(result.success){
           
            localStorage.setItem('selectedWarehouse', JSON.stringify(result.result));
            setWarehouseSelect(true);
            closeModal();
            location.reload();
          }
        
    
        } catch (error) {
          console.log(error);
         
        }
      }
    

  return (
    <>
     <Formik
      initialValues={{
        warehouse_id: '',
       
      }}
    //   validationSchema={YupObject({
    //     country_id: nameSchema,
      
    //   })}
      onSubmit={(values) => {
       GetWarehouse(values, closeModal);
       
      }}>
      <Form>
      <Row>
      <SearchableSelectInput
          nameList={[
            {
              name: 'warehouse_id',
              title: 'Warehouse',
              colprops: { xxl: 12, lg: 12, sm: 12 },
              inputprops: {
                name: 'warehouse_id',
                id: 'warehouse_id',
                options: warehouses,
                defaultOption: 'Select state',
              },
            },
           
          ]}
        />
<Col>
<div style={{display:'flex'}}>
<Btn title='Select' type='submit' className='btn btn-md btn-theme-outline fw-bold' style={{marginLeft:'auto'}}  />
</div>

</Col >
        
        {/* <Btn title='Yes' className='theme-bg-color btn-md fw-bold text-light' loading={Number(isLoading)} onClick={confirmFunction} /> */}
        </Row>
        </Form>
        </Formik>
    </>
  );
};

export default SelectWarehouse;
