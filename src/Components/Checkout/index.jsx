'use client';
import { Fragment,useState, useEffect, useContext } from 'react';
import Breadcrumb from '../Common/Breadcrumb';
import CheckoutForm from './CheckoutForm';
import WrapperComponent from '../Common/WrapperComponent';
import PaymentOptions from './PaymentOptions';
import Cookies from 'js-cookie';
import CustomerContext from '@/Helper/CustomerContext';
import withAuth from '@/Layout/AuthLayout';
import Loader from '@/Layout/Loader';

const CheckoutContent = () => {
  const [paymentOption, setPaymentOption] = useState('Cash');
  const [value, setValue] = useState();
  const [customer, setCustomer] = useState();
  const customerDetails = JSON.parse(localStorage.getItem('customerDetails')) || {};
  const isAuthString = Cookies.get("uat");
  const isAuth = isAuthString && isAuthString !== "ManagerLogin" ? JSON.parse(isAuthString) : null;

  useEffect(() => {
    if (isAuth !== "ManagerLogin" && isAuth) {
      setCustomer(isAuth);
    } else {
      if (customerDetails) {
        setCustomer(customerDetails);
      }
    }
  }, []);

  useEffect(() => {
    if (!isAuthString) {
      document.body.classList.add('skeleton-body');
    } else {
      document.body.classList.remove('skeleton-body');
    }
    return () => {
      document.body.classList.remove('skeleton-body');
    }
  }, [isAuthString]);

  if (!isAuthString) return <Loader />;
  
  return (
    <Fragment>
      <Breadcrumb title={'Checkout'} subNavigation={[{ name: 'Checkout' }]} />
      <WrapperComponent classes={{ sectionClass: 'compare-section section-b-space', row: 'g-0 compare-row' }} customCol={true}>
        {value || isAuthString == "ManagerLogin" ? <CheckoutForm paymentOption={paymentOption} cId={customerDetails.id} /> : <PaymentOptions value={value} paymentOption={paymentOption} setValue={setValue} setPaymentOption={setPaymentOption} />}
          
      </WrapperComponent>
    </Fragment>
  );
};

export default withAuth(CheckoutContent);
