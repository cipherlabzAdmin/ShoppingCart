import React, { useState } from 'react';
import { Label, Input } from 'reactstrap'; // Assuming you are using reactstrap or similar library
import { ModifyString } from '@/Utils/CustomFunctions/ModifyString';
import Image from 'next/image';



const PaymentOptionSelect = ({ option, selected, onSelect,paymentOption }) => {
  return (
    <Label className='form-check-label paymentOptionImg' htmlFor={option.name} style={{border: option.name == paymentOption ? '4px solid #050977' :'2px solid gray', borderRadius:'10px', cursor:'pointer'}}>
    <div className='payment-option px-4'>
      <div className='payment-category w-100'>
        <div className='form-check custom-form-check hide-check-box w-100' style={{paddingLeft:'0px'}}>
       
          <Input
          hidden
            className='form-check-input'
            id={option.name}
            checked={selected}
            type='radio's
            name='payment_method'
            onChange={() => onSelect(option.name)}
          />
          
            <Image src={option.image} alt={option.name} width={100} style={{objectFit:'cover'}}/>
           <p className='text-center' style={{fontWeight:'bold'}}> {ModifyString(option.name, 'upper')}</p>
        </div>
      </div>
    </div>
    </Label>
  );
};

export default PaymentOptionSelect;

