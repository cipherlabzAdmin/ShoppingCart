import React, { useContext, useMemo, useState } from "react";
import Btn from "@/Elements/Buttons/Btn";
import ThemeOptionContext from "@/Helper/ThemeOptionsContext";
import HeaderDealModal from "./HeaderDealModal";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import { RiFlashlightLine } from "react-icons/ri";
import { RiShoppingCart2Fill } from "react-icons/ri";
import CartContext from "@/Helper/CartContext";
import SettingContext from "@/Helper/SettingContext";

const TodaysDeal = () => {
  const { themeOption, cartCanvas, setCartCanvas } =
    useContext(ThemeOptionContext);
    const { convertCurrency } = useContext(SettingContext);
  const [modal, setModal] = useState(false);
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const { cartProducts,getTotal } = useContext(CartContext);
  const cartStyle = useMemo(() => {
    return themeOption?.general?.cart_style
      ? themeOption?.general?.cart_style
      : "cart_sidebar";
  });

  const total = useMemo(() => {
    return getTotal(cartProducts);
  }, [cartProducts, modal]);

  return (
    <>
      {themeOption?.header?.today_deals?.length > 0 && (
        <>
          <div className="header-nav-right">
            <Btn className="deal-btn" onClick={() => setModal(true)}>
              <RiFlashlightLine />
              <span>{t("DealToday")}</span>
            </Btn>
          </div>
          <HeaderDealModal
            modal={modal}
            setModal={setModal}
            data={themeOption?.header?.today_deals}
          />
        </>
      )}
      <div className="header-nav-right">
        <Btn
          className="cart-btn"
          onClick={() =>
            cartStyle == "cart_sidebar" && setCartCanvas(!cartCanvas)
          }
          style={{backgroundColor: 'var(--yellow)'}}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <RiShoppingCart2Fill
              style={{
                color: "var(--text-theme)",
                fontSize: "2rem",
                position: "relative",
              }}
            />
            <span
              className="badge-count"
              style={{
                position: "absolute",
                top: "-10px",
                right: "-10px",
                width:'25px',
                height:'25px',
                backgroundColor: "red",
                color: "white",
                borderRadius: "50%",
                padding: "0.25rem 0.5rem",
                fontSize: "0.8rem",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {cartProducts.length}
            </span>
          </div>
          <span>{convertCurrency(total)}</span>
        </Btn>
      </div>
    </>
  );
};

export default TodaysDeal;
