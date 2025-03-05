import React from "react";
import { Label, Input } from "reactstrap";
import { ModifyString } from "@/Utils/CustomFunctions/ModifyString";
import Image from "next/image";

const PaymentOptionSelect = ({ option, selected, onSelect, paymentOption }) => {
  return (
    <Label
      className="form-check-label paymentOptionImg"
      htmlFor={option.name}
      style={{
        border: option.name === paymentOption ? "4px solid #050977" : "2px solid gray",
        backgroundColor: option.name === paymentOption ? "#050977" : "transparent",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "background-color 0.3s, color 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#050977";
        e.currentTarget.querySelector("p").style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        if (option.name !== paymentOption) {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.querySelector("p").style.color = "black";
        }
      }}
    >
      <div className="payment-option px-4">
        <div className="payment-category w-100">
          <div
            className="form-check custom-form-check hide-check-box w-100"
            style={{ paddingLeft: "0px" }}
          >
            <Input
              hidden
              className="form-check-input"
              id={option.name}
              checked={selected}
              type="radio"
              name="payment_method"
              onChange={() => onSelect(option.name)}
            />

            <Image
              src={option.image}
              alt={option.name}
              width={100}
              style={{ objectFit: "cover" }}
            />
            <p
              className="text-center"
              style={{
                fontWeight: "bold",
                color: option.name === paymentOption ? "#fff" : "black",
                transition: "color 0.3s",
              }}
            >
              {ModifyString(option.name, "upper")}
            </p>
          </div>
        </div>
      </div>
    </Label>
  );
};

export default PaymentOptionSelect;
