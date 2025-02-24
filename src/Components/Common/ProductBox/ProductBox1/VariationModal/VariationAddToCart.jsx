import Btn from "@/Elements/Buttons/Btn";
import CartContext from "@/Helper/CartContext";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import { useContext } from "react";
import { RiShoppingCartLine } from "react-icons/ri";

const VariationAddToCart = ({ cloneVariation, setVariationModal }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const { cartProducts, handleIncDec } = useContext(CartContext);

  const productInStock = cloneVariation?.product?.quantity > 0 ? true : false;

  const addToCart = (allProduct) => {
    if (cloneVariation?.selectedVariation) {
      handleIncDec(
        cloneVariation.productQty,
        allProduct,
        false,
        false,
        false,
        cloneVariation
      );
      setVariationModal(false);
    } else {
      handleIncDec(cloneVariation.productQty, allProduct, false, false, false);
      setVariationModal(false);
    }
  };
  return (
    <div className="addtocart_btn">
      <Btn
        className="btn btn-md fw-bold icon text-white theme-bg-color view-button text-uppercase"
        // disabled={!productInStock}
        onClick={() => addToCart(cloneVariation.product)}
      >
        <RiShoppingCartLine />
        <span>{t("AddToCart")}</span>
      </Btn>
    </div>
  );
};
export default VariationAddToCart;
