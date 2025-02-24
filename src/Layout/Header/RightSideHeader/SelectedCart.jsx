import React, { useContext, useEffect } from "react";
import Link from "next/link";
import { RiDeleteBinLine, RiPencilLine } from "react-icons/ri";
import HandleQuantity from "@/Components/Cart/HandleQuantity";
import Avatar from "@/Components/Common/Avatar";
import Btn from "@/Elements/Buttons/Btn";
import CartContext from "@/Helper/CartContext";
import I18NextContext from "@/Helper/I18NextContext";
import SettingContext from "@/Helper/SettingContext";
import { placeHolderImage } from "../../../../Data/CommonPath";
import ThemeOptionContext from "@/Helper/ThemeOptionsContext";

const SelectedCart = ({ modal, setSelectedVariation, setModal }) => {
  const { convertCurrency } = useContext(SettingContext);
  const { i18Lang } = useContext(I18NextContext);
  const { cartProducts, removeCart } = useContext(CartContext);
  const { setCartCanvas } = useContext(ThemeOptionContext);
  const onEdit = (data) => {
    setSelectedVariation(() => data);
    setTimeout(() => {
      setModal(true);
    }, 0);
  };
  useEffect(() => {
    cartProducts?.filter((elem) => {
      if (elem?.variation) {
        elem.variation.selected_variation = elem?.variation?.attribute_values
          ?.map((values) => values?.value)
          .join("/");
      } else {
        elem;
      }
    });
  }, [modal]);

  return (
    <>
      <ul className="cart-list">
        {cartProducts.map((elem, i) => (
          <li className="product-box-contain" key={i}>
            <div className="drop-cart">
              <Link
                href={`/${i18Lang}/product/${elem?.product.id}`}
                onClick={() =>
                  setTimeout(() => setCartCanvas((prev) => !prev), 1000)
                }
                className="drop-image"
              >
                <Avatar
                  data={elem.product.imageURL}
                  placeHolder={placeHolderImage}
                  name={elem?.product?.name}
                  height={72}
                  width={87}
                />
              </Link>

              <div className="drop-contain">
                <Link href={`/${i18Lang}/product/${elem?.product?.id}`}>
                  <h5>{elem?.variation?.name ?? elem?.product?.name}</h5>
                </Link>
                <h6>
                  {convertCurrency(
                    (elem?.product?.sellingPrice ??
                      elem?.product?.sellingPrice)
                  )}
                </h6>

                {elem?.product?.discountAmount ? (
                  <h6 className="text-danger">
                    <del>
                      {convertCurrency(
                        (elem?.product?.sellingPrice ??
                          elem?.product?.sellingPrice) +
                          (elem?.product?.discountAmount ?? 0)
                      )}
                    </del>
                  </h6>
                ) : (
                  ""
                )}

                {elem?.variation && (
                  <h5 className="gram">
                    {elem?.variation?.selected_variation ??
                      elem?.product?.selected_variation}
                  </h5>
                )}
                <ul>
                  <HandleQuantity
                    productObj={elem?.product}
                    elem={elem}
                    customIcon={<RiDeleteBinLine />}
                  />
                </ul>
                <div>
                  <div className="header-button-group">
                    {elem?.variation && (
                      <Btn
                        className="edit-button close_button"
                        onClick={() => onEdit(elem)}
                      >
                        <RiPencilLine />
                      </Btn>
                    )}
                    <Btn
                      className="delete-button close_button"
                      onClick={() => removeCart(elem?.product_id, elem?.id)}
                    >
                      <RiDeleteBinLine />
                    </Btn>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SelectedCart;
