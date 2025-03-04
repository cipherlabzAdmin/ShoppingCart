import React, { useContext } from "react";
import { CardBody } from "reactstrap";
import SettingContext from "../../../Helper/SettingContext";
import Image from "next/image";
import CartContext from "@/Helper/CartContext";
import { placeHolderImage } from "../../../../Data/CommonPath";
import { useTranslation } from "@/app/i18n/client";
import I18NextContext from "@/Helper/I18NextContext";

const SidebarProduct = ({ values }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const { cartProducts } = useContext(CartContext);
  const { convertCurrency } = useContext(SettingContext);
  const customerDetails =
    JSON.parse(localStorage.getItem("customerDetails")) || {};

  return (
    <CardBody>
      <div className="title-header">
        <h5 className="fw-bold">{t("Checkout")} </h5>
      </div>
      <h3>
        {customerDetails.firstName
          ? `${customerDetails.firstName} ${customerDetails.lastName}`
          : ""}
      </h3>
      <div className="product-details">
        <>
          <ul className="cart-listing">
            {cartProducts?.map((item, i) => (
              <li key={i}>
                <Image
                  src={
                    item.product.imageURL
                      ? item.product.imageURL
                      : placeHolderImage
                  }
                  className="img-fluid"
                  alt={item?.product?.name || "product"}
                  width={70}
                  height={70}
                />
                <div className="cart-content">
                  <h4>
                    {item?.variation
                      ? item?.variation?.name
                      : item?.product?.name}
                  </h4>
                  <h5 className="text-theme">
                    <del
                      className="text-secondary"
                      style={{ paddingRight: "10px" }}
                    >
                      {item?.product?.discountAmount
                        ? convertCurrency(
                            item?.product?.sellingPrice
                          )
                        : ""}
                    </del>
                    {item?.variation
                      ? convertCurrency(item?.product?.sellingPrice-item?.product?.discountAmount)
                      : convertCurrency(item?.product?.sellingPrice-item?.product?.discountAmount)}{" "}
                    x {item.quantity}
                  </h5>
                  <h5 className="price">
                    {convertCurrency(
                      (item?.variation
                        ? item?.product?.sellingPrice
                        : item?.product?.sellingPrice) * item.quantity
                    )}
                  </h5>
                </div>
              </li>
            ))}
          </ul>
        </>
      </div>
    </CardBody>
  );
};

export default SidebarProduct;
