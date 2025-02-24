import React, { useContext, useMemo } from "react";
import Link from "next/link";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import CompareContext from "@/Helper/CompareContext";
import { RiShoppingCartFill } from "react-icons/ri";
import Btn from "@/Elements/Buttons/Btn";
import { Badge } from "reactstrap";
import CartContext from "@/Helper/CartContext";
import ThemeOptionContext from "@/Helper/ThemeOptionsContext";
import Draggable from "react-draggable";

const Cart = () => {
  const { i18Lang } = useContext(I18NextContext);
  const { compareState } = useContext(CompareContext);
  const { cartProducts } = useContext(CartContext);
  const { themeOption, cartCanvas, setCartCanvas } =
    useContext(ThemeOptionContext);
  const { t } = useTranslation(i18Lang, "common");

  const cartStyle = useMemo(() => {
    return themeOption?.general?.cart_style
      ? themeOption?.general?.cart_style
      : "cart_sidebar";
  });

  if (cartProducts?.length == 0) {
    return null;
  } else
    return (
      <Draggable>
        <div
          className="setting-box-cart position-relative"
          onClick={() =>
            cartStyle == "cart_sidebar" && setCartCanvas(!cartCanvas)
          }
        >
          <Btn className="btn setting-button-cart text-white setting-button-cart">
            <RiShoppingCartFill />
          </Btn>
          {cartProducts.length > 0 && (
            <Badge
              className="badge-position"
              color="danger"
              style={{ position: "absolute", top: -8, right: -5 }}
            >
              {cartProducts.length}
            </Badge>
          )}
        </div>
      </Draggable>
    );
};

export default Cart;
