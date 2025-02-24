import { useContext, useEffect, useState } from "react";
import { Col } from "reactstrap";
import Btn from "@/Elements/Buttons/Btn";
import CartContext from "@/Helper/CartContext";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import Link from "next/link";
import Cookies from "js-cookie";
import { RiArrowLeftLine } from "react-icons/ri";
import { RiShoppingCart2Fill } from "react-icons/ri";
import SettingContext from "@/Helper/SettingContext";

const CartSidebar = () => {
  const { cartProducts, getTotal } = useContext(CartContext);
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const isAuth = Cookies.get("uat");
  const [discount, setDiscount] = useState();
  const { convertCurrency } = useContext(SettingContext);

  useEffect(() => {  
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
    }, []);

  return (
    <Col xxl={3} xl={4}>
      <div
        className="summery-box p-sticky"
        style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
      >
        <div
          style={{
            background: "var(--theme-color)",
            color: "white",
            display: "flex",
            justifyContent: "center",
            gap: "1vw",
          }}
          className="summery-header"
        >
          <RiShoppingCart2Fill
            style={{
              color: "var(--yellow)",
              fontSize: "2rem",
              position: "relative",
            }}
          />
          <h3>{cartProducts.length}</h3>
          <h3>{t("Items")}</h3>
        </div>

        <div className="summery-contain">
          <ul>
            <li>
              <h4>{t("Subtotal")}</h4>
              <h4 className="price">
                {convertCurrency(getTotal(cartProducts) + discount)}
              </h4>
            </li>

            {/* <li className="align-items-start">
              <h4>{t("Shipping")}</h4>
              <h4 className="price text-end">{t("CostatCheckout")}</h4>
            </li> */}
            {/* <li className="align-items-start">
              <h4>{t("Tax")}</h4>
              <h4 className="price text-end">{t("CostatCheckout")}</h4>
            </li> */}

            <li className="align-items-start">
              <h4  style={{fontWeight: 600}}>{t("Discount")}</h4>
              <h4 className="price text-end" style={{fontWeight: 900}}>
              {convertCurrency(discount ?? 0)}
              </h4>
            </li>
          </ul>
        </div>

        <ul
          style={{
            background: "var(--theme-color)",
            marginBottom: '1vw'
          }}
          className="summery-total"
        >
          <li
            style={{
              display: "flex",
              justifyContent: "space-between",
          
            }}
            className="list-total border-top-0"
          >
            <h4 style={{ color: "white" }}>{t("Total")}</h4>
            <h4 style={{ color: "white" }} className="price">
              {convertCurrency(getTotal(cartProducts)?.toFixed(2))}
            </h4>
          </li>
        </ul>

        <div className="button-group cart-button">
          <ul>
            <li>
              <Link
                href={
                  isAuth ? `/${i18Lang}/checkout` : `/${i18Lang}/auth/login`
                }
                className="btn btn-animation proceed-btn fw-bold"
              >
                {t("ProcessToCheckout")}
              </Link>
            </li>

            <li>
              <Btn className="btn btn-light shopping-button text-dark">
                <RiArrowLeftLine /> {t("ReturnToShopping")}
              </Btn>
            </li>
          </ul>
        </div>
      </div>
    </Col>
  );
};

export default CartSidebar;
