import { Col, Input, Label, Row } from "reactstrap";
import { RiBankCardLine } from "react-icons/ri";
import { useTranslation } from "@/app/i18n/client";
import I18NextContext from "@/Helper/I18NextContext";
import { Fragment, useContext, useEffect, useState } from "react";
import PaymentOptionSelect from "./paymentOptionSelect";
import Cash from "../../../public/assets/images/payment-icon/cash.png";
import Credit from "../../../public/assets/images/payment-icon/credit.png";
import Card from "../../../public/assets/images/payment-icon/card.png";
import swal from "sweetalert";

import Btn from "@/Elements/Buttons/Btn";
import { ToastContainer, toast } from "react-toastify";

const PaymentOptions = ({
  value,
  paymentOption,
  setValue,
  setPaymentOption,
}) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const userType = localStorage.getItem("userType");

  let paymentOptions = [
    { id: 1, name: "Cash", image: Cash },
    { id: 2, name: "Card", image: Card },
    { id: 3, name: "Credit", image: Credit },
  ];
  
  if (userType === "3") {
    paymentOptions = [
      { id: 3, name: "Credit", image: Credit },
    ];
  }

  const paymentOptionId = parseInt(
    paymentOptions?.filter((payment) => payment?.name === paymentOption)[0]?.id
  );

  const handlePaymentOptionSelect = (name) => {
    setPaymentOption(name);
    if(name === 'credit'){
swal('Please note that the credit payment will be processed only after manager approval');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="d-flex justify-content-center">
        <div className="card" style={{ width: "70%" }}>
          <div
            className="card-header"
            style={{ background: "var(--theme-color)", padding: "1vw" }}
          >
            <h4 style={{ color: "white", textAlign: "center" }}>
              <RiBankCardLine style={{ marginRight: "10px" }} />
              {t("SelectPaymentOption")}
            </h4>
          </div>
          <div
            className="card-body"
            style={{
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
              padding: "1vw",
              paddingTop: "2vw",
            }}
          >
            <div className="checkout-detail">
              <Row
                className="g-sm-4 g-3"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {paymentOptions.map((option, index) => (
                  <Col
                    xxl={3}
                    key={index}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <PaymentOptionSelect
                      key={index}
                      option={option}
                      paymentOption={paymentOption}
                      selected={paymentOption === option.name}
                      onSelect={(name) => handlePaymentOptionSelect(name)}
                    />
                  </Col>
                ))}
              </Row>
              <div
                className="mt-4"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Btn
                  onClick={() => setValue(paymentOptionId)}
                  className="btn-md fw-bold text-light theme-bg-color"
                  type="submit"
                  title="Continue"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    // </CheckoutCard>
  );
};

export default PaymentOptions;
