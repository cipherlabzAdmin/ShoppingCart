import React, { useContext, useEffect, useState } from "react";
import { Card, Col } from "reactstrap";
import SettingContext from "../../../Helper/SettingContext";
import { useTranslation } from "@/app/i18n/client";
import SidebarProduct from "./SidebarProduct";
import CartContext from "@/Helper/CartContext";
import PointWallet from "./PointWallet";
import I18NextContext from "@/Helper/I18NextContext";
import ApplyCoupon from "./ApplyCoupon";
import PlaceOrder from "./PlaceOrder";

const CheckoutSidebar = ({ values, setFieldValue, cId }) => {

  const [storeCoupon, setStoreCoupon] = useState();
  const [discount, setDiscount] = useState();
  const [checkoutData, setCheckoutData] = useState({
    total: {
      convert_point_amount: -10,
      convert_wallet_balance: -84.4,
      coupon_total_discount: 10,
      points: 300,
      points_amount: 10,
      shipping_total: 0,
      sub_total: 35.19,
      tax_total: 2.54,
      total: 37.73,
      wallet_balance: 84.4,
    },
  });

  const { convertCurrency } = useContext(SettingContext);
  const { cartProducts, cartTotal,getTotal, setCartTotal } = useContext(CartContext);
  const { itemTotal, setItemTotal } = useState();
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");

  const [appliedDeliveryCharge, setAppliedDeliveryCharge] = useState(0);

  // Function to calculate delivery charge based on delivery_description
  const calculateDeliveryCharge = (deliveryDescription) => {
    const charges = {
      1: 290.0,
      2: 0.0,
      3: 390.0,
      4: 490.0,
      5: 0.0,
      6: 190.0,
    };
    return charges[deliveryDescription] || 0.0;
  };

  const deliveryChargeValue = calculateDeliveryCharge(
    values.delivery_description
  );
  // Update cart total when delivery_description changes
  useEffect(() => {
    if (values?.delivery_description) {
      const deliveryCharge = calculateDeliveryCharge(
        values.delivery_description
      );

      // Prevent duplicate addition of delivery charge
      if (deliveryCharge !== appliedDeliveryCharge) {
        const updatedTotal = cartTotal - appliedDeliveryCharge;
        setCartTotal(updatedTotal);
        setAppliedDeliveryCharge(deliveryCharge); // Track applied charge
      }
    }

    const isCartAvaliable = JSON.parse(localStorage.getItem("cart"));
    if (isCartAvaliable?.items?.length > 0) {
      const discountSum =
        isCartAvaliable.items?.reduce((sum, item) => {
          const discount =
            (item.product?.discountAmount ?? 0) * (item.quantity ?? 1);
          return sum + discount;
        }, 0) || 0;

      setDiscount(discountSum);
    }
  }, [
    values?.delivery_description,
    cartTotal,
    appliedDeliveryCharge,
    setCartTotal,
  ]);

  const calculatedPrice = checkoutData?.total?.sub_total
    ? convertCurrency(cartTotal) -
      calculateDeliveryCharge(values.delivery_description)
    : t("Notcalculatedyet");

    

  const totalSubTotal = (values.cart || []).reduce(
    (sum, item) => sum + (item?.sub_total || 0),
    0
  );

  const tot = getTotal(cartProducts) +calculateDeliveryCharge(values.delivery_description);

  return (
    <Col xxl="4" xl="5" className="mx-auto">
      <Card className="pos-detail-card">
        <SidebarProduct values={values} setFieldValue={setFieldValue} />
        <div className="pos-loader">
          <ul className={`summary-total position-relative`}>
            <li>
              <h4>{t("Total")}</h4>
              <h4 className="price">
                {checkoutData?.total?.sub_total
                  ? convertCurrency(totalSubTotal)
                  : t(`Notcalculatedyet`)}
              </h4>
            </li>
            {/* <li>
              <h4>{t("Shipping")}</h4>
              <h4 className="price">
                {checkoutData?.total?.shipping_total >= 0
                  ? convertCurrency(checkoutData?.total?.shipping_total)
                  : t(`Notcalculatedyet`)}
              </h4>
            </li> */}
            {/* <li>
              <h4>{t("Tax")}</h4>
              <h4 className="price">
                {checkoutData?.total?.tax_total
                  ? convertCurrency(0.0)
                  : t(`Notcalculatedyet`)}
              </h4>
            </li> */}
            <li>
              <h4>{t("Discount")}</h4>
              <h4 className="price">
                {discount ? convertCurrency(discount) : convertCurrency(0)}
              </h4>
            </li>

            {values?.delivery_description && (
              <li>
                <h4>{t("DeliveryCharge")}</h4>
                <h4 className="price">
                  {convertCurrency(
                    calculateDeliveryCharge(values.delivery_description)
                  )}
                </h4>
              </li>
            )}

            <li className="list-total">
              <h4>{t("Subtotal")}</h4>
              <h4 className="price">
                {convertCurrency(getTotal(cartProducts) +calculateDeliveryCharge(values.delivery_description))}
              </h4>
            </li>
          </ul>
        </div>
        <PlaceOrder
          total={tot}
          sub={totalSubTotal}
          deliveryCharges={calculateDeliveryCharge(values.delivery_description)}
          values={values}
          cId={cId}
          discount={discount}
        />
      </Card>
    </Col>
  );
};

export default CheckoutSidebar;
