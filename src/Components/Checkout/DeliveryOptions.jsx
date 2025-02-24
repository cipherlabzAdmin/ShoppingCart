import React, { useContext, useEffect, useState } from "react";
import { RiTruckLine } from "react-icons/ri";
import { Col, Input, Label, Row } from "reactstrap";
import CheckoutCard from "./common/CheckoutCard";
import { useTranslation } from "@/app/i18n/client";
import SettingContext from "@/Helper/SettingContext";
import I18NextContext from "@/Helper/I18NextContext";

const baseUrl = process?.env?.API_BASE_URL;

const DeliveryOptions = ({ values, setFieldValue, paymentOption }) => {
  const today = new Date();
  const defaultdate = today.toLocaleDateString("en-CA", { timeZone: "Asia/Colombo" });
  const [deliveryDate, setDeliveyDate] = useState(defaultdate);
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const { settingData } = useContext(SettingContext);
  const [defaultDe, setDefaultDe] = useState(0);

  const [deliveryMethod, setDeliveryMethod] = useState(null);

  useEffect(() => {
    if (deliveryMethod?.items?.length) {
      setFieldValue("delivery_description", `${deliveryMethod.items[0]?.id}`);
      setDefaultDe(0);
    }
  }, [deliveryMethod]);

  useEffect(() => {
    async function fetchDeliveryMethods() {
      try {
        const response = await fetch(
          `${baseUrl}services/ecommerce/deliveryMethod/GetAll`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              keyword: "",
              isActive: true,
              sortType: 3,
              skipCount: 0,
              maxResultCount: 100,
            }),
          }
        );
        const deliveryData = await response.json();

        setDeliveryMethod(deliveryData.result);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchDeliveryMethods();
  }, []);

  useEffect(() => {
    setFieldValue("payment_options", paymentOption);
  }, []);

  const handleSetDate = (option) => {
    const sriLankaTime = new Date(
      today.toLocaleString("en-US", { timeZone: "Asia/Colombo" })
    );

    if (option === 1) {
      sriLankaTime.setDate(sriLankaTime.getDate() + 1);
    } else if (option === 2) {
      sriLankaTime.setDate(sriLankaTime.getDate());
    } else if (option === 3) {
      sriLankaTime.setHours(sriLankaTime.getHours() + 8);
    } else if (option === 4) {
      sriLankaTime.setHours(sriLankaTime.getHours() + 4);
    }

    const year = sriLankaTime.getFullYear();
    const month = String(sriLankaTime.getMonth() + 1).padStart(2, "0");
    const day = String(sriLankaTime.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    setDeliveyDate(formattedDate);
  };

  return (
    <CheckoutCard icon={<RiTruckLine />}>
      <div className="checkout-title">
        <h4>Delivery Option</h4>
      </div>
      <div className="checkout-detail">
        <Row className="g-4">
          {deliveryMethod?.items &&
            deliveryMethod?.items.map((option, index) => (
              <Col xxl={6} key={index}>
                <div className="delivery-option">
                  <div className="delivery-category">
                    <div className="shipment-detail w-100">
                      <div className="form-check custom-form-check">
                        <Input
                          className="form-check-input"
                          type="radio"
                          name="standard"
                          checked={defaultDe == index}
                          id={`standard1${index}`}
                          onChange={() => {
                            setFieldValue(
                              "delivery_description",
                              `${option?.id}`
                            );
                            handleSetDate(option?.id);
                            setDefaultDe(index);
                          }}
                        />
                        <Label
                          className="form-check-label"
                          htmlFor={`standard1${index}`}
                        >
                          {option?.title} |{" "}
                          <span style={{ color: "gray" }}></span>{" "}
                          {option?.description}
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
        </Row>
      </div>
      <div className="checkout-title mt-3">
        <h4>Other</h4>
      </div>
      <div className="checkout-detail">
        <div className="row">
          <div className="col-lg-6 col-12">
            <label className="fw-500 text-secondary mb-2">Delivery Date</label>
            <input
              type="date"
              className="w-100 border-0 rounded-1 p-3"
              value={values.delivery_date || deliveryDate}
              onChange={(e) => setFieldValue("delivery_date", e.target.value)}
            />
          </div>
          <div className="col-lg-6 col-12">
            <label className="fw-500 text-secondary mb-2">Special Note</label>
            <input
              type="text"
              className="w-100 border-0 rounded-1 p-3"
              value={values.special_note || ""}
              onChange={(e) => setFieldValue("special_note", e.target.value)}
            />
          </div>
        </div>
      </div>
    </CheckoutCard>
  );
};

export default DeliveryOptions;
