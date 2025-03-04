import React, { useContext, useEffect, useState } from "react";
import Btn from "@/Elements/Buttons/Btn";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";
import CartContext from "@/Helper/CartContext";
import { ToastNotification } from "../../../Utils/CustomFunctions/ToastNotification";
const baseUrl = process?.env?.API_BASE_URL;
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const PlaceOrder = ({ values, cId, deliveryCharges, total, discount,sub }) => {
  const storedWarehouse = JSON.parse(localStorage.getItem("selectedWarehouse"));
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const { cartProducts, removeCart, clearCart, cartTotal, cartItems } =
    useContext(CartContext);
  const router = useRouter();
  const [customer, setCustomer] = useState();

  const customerDetails =
    JSON.parse(localStorage.getItem("customerDetails")) || {};
  const isAuthString = Cookies.get("uat");
  const isAuth =
    isAuthString && isAuthString !== "ManagerLogin"
      ? JSON.parse(isAuthString)
      : null;
  const token = Cookies.get("uatoken");

  useEffect(() => {
    if (isAuth !== "ManagerLogin" && isAuth) {
      setCustomer(isAuth);
    } else {
      setCustomer(customerDetails);
    }
  }, []);

  const header = {
    "Content-Type": "application/json",
  };

  const headerManger = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  async function checkoutCart(data) {
    try {
      const response = await fetch(
        `${baseUrl}services/ecommerce/checkout/Create`,
        {
          method: "POST",
          headers: isAuth == "ManagerLogin" ? headerManger : header,
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (result.success) {
        clearCart();

        ToastNotification("success", "Order Created Successfully!");
        router.push(`/${i18Lang}/theme/paris`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleClick = () => {
    const data = {
      checkoutNo: "string",
      eCommerceCustomerId: customer.id,
      warehouseId: storedWarehouse.id,
      latitude: values.billing_address.latitude,
      longitude: values.billing_address.longitude,
      subTotal: sub,
      discount: discount,
      deliveryMethodId: values.delivery_description,
      totalAmount: total,
      isShippingAddressIsSameAsBillingAddress: true,
      cartItems: cartItems,
      deliveryDate: values.delivery_date,
      specialNote: values.special_note,
      paymentMethod:
        values.payment_options.paymentOption === "Cash"
          ? 1
          : values.payment_options.paymentOption === "credit"
          ? 3
          : 2,
      deliverychargeAmount: deliveryCharges,
      checkoutAddresses: [
        isAuthString != "ManagerLogin"
          ? values.shipping_address
          : {
              address1: "matara",
              address2: "matara",
              cityId: "00000000-0000-0000-0000-000000000000",
              postalCode: "2535",
              locationLink: "string",
              latitude: "string",
              longitude: "string",
              addressType: 1,
              eCommerceCustomerId: customer.id,
            },
      ],
    };
    if (values.billing_address) {
      checkoutCart(data);
    } else {
      toast.info("Please Select Billing Address");
    }
  };

  return (
    <Btn
      className="btn-md fw-bold mt-4 text-white theme-bg-color w-100"
      onClick={handleClick}
    >
      {t("PlaceOrder")}
    </Btn>
  );
};

export default PlaceOrder;
