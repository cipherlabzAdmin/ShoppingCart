import { Form, Formik } from "formik";
import { Col, Row } from "reactstrap";
import DeliveryAddress from "./DeliveryAddress";
import DeliveryOptions from "./DeliveryOptions";
import { useContext, useEffect, useState } from "react";
import AccountContext from "@/Helper/AccountContext";
import CheckoutSidebar from "./CheckoutSidebar";
import CustomerContext from "@/Helper/CustomerContext";
import Cookies from "js-cookie";

const CheckoutForm = (paymentOption) => {
  const { accountData, refetch } = useContext(AccountContext);
  const { billingAddress, checkoutAddress } = useContext(CustomerContext);
  const [address, setAddress] = useState([]);
  const [addressBillingCustomer, setAddressBillingCustomer] = useState();
  const [addressCheckoutCustomer, setAddressCheckoutCustomer] = useState();
  const [modal, setModal] = useState("");
  const isAuth = Cookies.get("uat");
  useEffect(() => {
    accountData?.address.length > 0 &&
      // eslint-disable-next-line no-unsafe-optional-chaining
      setAddress((prev) => [...accountData?.address]);
  }, [accountData]);

  const addAddress = () => {
    setModal("");
  };

  useEffect(() => {
    setAddressBillingCustomer(billingAddress);
    setAddressCheckoutCustomer(checkoutAddress);
  }, [billingAddress, billingAddress]);

  const [deliveryOption, setDeliveryOption] = useState("");

  return (
    <Formik
      initialValues={{
        billing_address: billingAddress?.length ? billingAddress[0] : "",
        shipping_address: billingAddress?.length ? billingAddress[0] : "",
        delivery_date: "",
        special_note: "",
      }}
    >
      {({ values, setFieldValue }) => {
        useEffect(() => {
          if (values.billing_address) {
            setFieldValue("shipping_address", values.billing_address);
          }
        }, [values.billing_address]);

        return (
          <Form>
            <div className="pb-4 checkout-section-2">
              <Row className="g-sm-4 g-3">
                {isAuth !== "ManagerLogin" && (
                  <Col xxl="8" xl="7">
                    <div className="left-sidebar-checkout">
                      <div className="checkout-detail-box">
                        <ul>
                          <DeliveryOptions
                            paymentOption={paymentOption}
                            values={values}
                            setFieldValue={setFieldValue}
                          />

                          <DeliveryAddress
                            key="billing"
                            type="billing"
                            title={"Billing"}
                            values={values}
                            setFieldValue={setFieldValue}
                            address={address}
                            modal={modal}
                            mutate={addAddress}
                            setModal={setModal}
                            cId={paymentOption.cId}
                          />

                          <DeliveryAddress
                            key="shipping"
                            type="shipping"
                            title={"Shipping"}
                            values={values}
                            setFieldValue={setFieldValue}
                            address={address}
                            modal={modal}
                            mutate={addAddress}
                            setModal={setModal}
                            cId={paymentOption.cId}
                          />
                        </ul>
                      </div>
                    </div>
                  </Col>
                )}

                <CheckoutSidebar
                  values={values}
                  setFieldValue={setFieldValue}
                  cId={paymentOption.cId}
                />
              </Row>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CheckoutForm;
