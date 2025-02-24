import React, { useContext, useEffect, useState } from "react";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { RiAddLine, RiMapPinLine } from "react-icons/ri";
import { useTranslation } from "@/app/i18n/client";
import CheckoutCard from "./common/CheckoutCard";
import CustomModal from "../Common/CustomModal";
import AddAddressForm from "./common/AddAddressForm";
import I18NextContext from "@/Helper/I18NextContext";
import CustomerContext from "@/Helper/CustomerContext";
import ShowAddress from "./ShowAddress";
import LocationPickUp from "./LocationPickUp";
import CartContext from "@/Helper/CartContext";
import { Field } from "formik";
import { ReactstrapRadio } from "../../Components/ReactstrapFormik";

const DeliveryAddress = ({
  type,
  title,
  values,
  address,
  modal,
  mutate,
  setModal,
  setFieldValue,
  cId,
}) => {
  const { i18Lang } = useContext(I18NextContext);
  const { billingAddress, checkoutAddress, setFetchAddress } =
    useContext(CustomerContext);
  const { t } = useTranslation(i18Lang, "common");
  const [addressCustomer, setAddressCustomer] = useState();
  const { cartProducts, removeCart } = useContext(CartContext);

  useEffect(() => {
    setFieldValue("cart", cartProducts);
  }, []);

  useEffect(() => {
    if (type == "billing") {
      setAddressCustomer(billingAddress);
    } else {
      setAddressCustomer(checkoutAddress);
    }
  }, [billingAddress, checkoutAddress]);

  return (
    <>
      <CheckoutCard icon={<RiMapPinLine />}>
        <div className="checkout-title">
          <h4>
            {t(title)} {t("Address")}
          </h4>
          {/* {type == "billing" && (<a className='d-flex align-items-center fw-bold' onClick={() => setModal(type)}>
            <RiAddLine className='me-1'></RiAddLine>
            {t('AddNew')}
          </a>)} */}
        </div>
        <div className="checkout-detail">
          {
            <>
            {title === "Shipping" ? (
              <Row className="g-4">
                
                  <Col xxl={12}>
                    <Label htmlFor={`address`} style={{ width: "100%" }}>
                      <div
                        className="delivery-address-box d-flex gap-2"
                        style={{ width: "100%" }}
                      >
                        <Field
                          component={ReactstrapRadio}
                          id={`address-${type}-0`}
                          className="form-check-input"
                          type="radio"
                          name={`${type}_address`}
                          value={values.billing_address}
                          index={0}
                        />
                        <ul className="delivery-address-detail">
                          <li>
                            <h5 className="text-title mt-1">
                              Same as Billing Address
                            </h5>
                          </li>
                        </ul>
                      </div>
                    </Label>
                  </Col>
                
              </Row>
              ) : (
                ""
              )}
              {addressCustomer?.length > 0 ? (
                <Row className="g-4 mt-1">
                  {/* {title === "Shipping" ? (
                    <Col xxl={12}>
                      <Label htmlFor={`address`} style={{ width: "100%" }}>
                        <div
                          className="delivery-address-box d-flex gap-2"
                          style={{ width: "100%" }}
                        >
                          <Field
                            component={ReactstrapRadio}
                            id={`address-${type}-0`}
                            className="form-check-input"
                            type="radio"
                            name={`${type}_address`}
                            value={values.billing_address}
                            index={0}
                          />
                          <ul className="delivery-address-detail">
                            <li>
                              <h5 className="text-title mt-1">
                                Same as Billing Address
                              </h5>
                            </li>
                          </ul>
                        </div>
                      </Label>
                    </Col>
                  ) : (
                    ""
                  )} */}

                  {addressCustomer?.map((item, i) => (
                    <ShowAddress
                      item={item}
                      key={i}
                      type={type}
                      index={type === "billing" ? i : i + 1}
                      setFieldValue={setFieldValue}
                    />
                  ))}
                </Row>
              ) : (
                <div className="empty-box">
                  <h2>{t("NoaddressFound")}</h2>
                </div>
              )}

              {/* {type != "billing" && <LocationPickUp modal={modal} setModal={setModal}/>}   */}

              <LocationPickUp modal={modal} type={type} setModal={setModal} />
            </>
          }
          <CustomModal
            modal={modal == type ? true : false}
            setModal={setModal}
            classes={{
              modalClass: "theme-modal view-modal modal-lg",
              modalHeaderClass: "p-0",
            }}
          >
            <div className="right-sidebar-box">
              <AddAddressForm
                mutate={mutate}
                setModal={setModal}
                type={type}
                cId={cId}
                setFetchAddress={setFetchAddress}
              />
            </div>
          </CustomModal>
        </div>
      </CheckoutCard>
    </>
  );
};

export default DeliveryAddress;
