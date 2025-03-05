import { useContext } from "react";
import HandleQuantity from "./HandleQuantity";
import CartContext from "@/Helper/CartContext";
import CartProductDetail from "./CartProductDetail";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import SettingContext from "@/Helper/SettingContext";

const CartData = ({ elem }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const { removeCart } = useContext(CartContext);
  const { convertCurrency } = useContext(SettingContext);
  return (
    <>
      <tr className="product-box-contain">
        <CartProductDetail elem={elem} />

        <td className="price" style={{ paddingTop: "2vw" }}>
          {/* <h4 className='table-title text-content'>{t('Price')}</h4> */}
          <h5>
            {convertCurrency(elem?.product?.sellingPrice - elem?.product?.discountAmount)}{" "}
            {elem?.product?.discountAmount ? (
              <del
                className="text-content text-danger"
              >
                {convertCurrency(
                  elem?.product?.sellingPrice
                )}
              </del>
            ) : (
              ""
            )}
          </h5>
        </td>

        <td className="quantity" style={{ paddingTop: "2vw" }}>
          {/* <h4 className='table-title text-content'>{t('Qty')}</h4> */}
          <HandleQuantity
            productObj={elem?.product}
            classes={{ customClass: "quantity-price" }}
            elem={elem}
          />
        </td>

        <td className="subtotal" style={{ paddingTop: "2vw" }}>
          {/* <h4 className='table-title text-content'>{t('Total')}</h4> */}
          <h5>{convertCurrency(elem?.sub_total)}</h5>
        </td>

        <td className="save-remove" style={{ paddingTop: "2vw" }}>
          {/* <h4 className='table-title text-content'>{t('Action')}</h4> */}
          <a className="save notifi-wishlist">{t("Saveforlater")}</a>
          <a
            className="remove close_button"
            onClick={() => removeCart(elem.product_id, elem?.id)}
          >
            {t("Remove")}
          </a>
        </td>
      </tr>
    </>
  );
};

export default CartData;
