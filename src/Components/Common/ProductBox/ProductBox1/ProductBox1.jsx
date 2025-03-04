import React, { useContext } from "react";
import Link from "next/link";
import { RiCloseLine } from "react-icons/ri";
import ProductBoxAction from "./ProductBox1Action";
import ProductBox1Cart from "./ProductBox1Cart";
import ProductBox1Rating from "./ProductBox1Rating";
import Avatar from "../../Avatar";
import { placeHolderImage } from "../../../../../Data/CommonPath";
import Btn from "@/Elements/Buttons/Btn";
import I18NextContext from "@/Helper/I18NextContext";
import ProductBagde from "./ProductBagde";
import SettingContext from "@/Helper/SettingContext";
import { ModifyString } from "@/Utils/CustomFunctions/ModifyString";
import { Label } from "reactstrap";

const ProductBox1 = ({
  fearcher,
  imgUrl,
  productDetail,
  isClose,
  addAction = true,
  classObj,
  setWishlistState,
}) => {
  const { i18Lang } = useContext(I18NextContext);
  const { convertCurrency } = useContext(SettingContext);
  const handelDelete = (currObj) => {
    setWishlistState((prev) => prev.filter((elem) => elem.id !== currObj?.id));
  };

  //console.log(19, productDetail);
  return (
    <div className={`product-box ${classObj?.productBoxClass}`}>
      {productDetail.quantity <= 0 ? (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            backgroundColor: "red",
            color: "white",
            padding: "5px 10px",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "3px",
            zIndex: 1,
          }}
          className="badge out-of-stock-badge"
        >
          Out of Stock
        </div>
      ) : (
        ""
      )}

      <ProductBagde is_fearchered={fearcher} productDetail={productDetail} />
      {isClose && (
        <div
          className="product-header-top"
          onClick={() => handelDelete(productDetail)}
        >
          <Btn className="wishlist-button close_button">
            <RiCloseLine />
          </Btn>
        </div>
      )}
      <div className="product-image" style={{ position: "relative" }}>
        <Link href={`/${i18Lang}/product/${productDetail?.id}`}>
          <Avatar
            data={productDetail?.imageURL}
            placeHolder={placeHolderImage}
            customeClass={"img-fluid"}
            name={productDetail.title}
            height={500}
            width={500}
          />
        </Link>
        <ProductBoxAction
          productObj={productDetail}
          listClass="product-option"
        />
      </div>
      <div className="product-detail">
        <Link href={`/${i18Lang}/product/${productDetail?.id}`}>
          <h6 className="name">{productDetail.name}</h6>
          <p dangerouslySetInnerHTML={{ __html: productDetail?.description }} />
        </Link>
        {productDetail?.unit && (
          <h6 className="unit mt-1">{productDetail?.unit}</h6>
        )}
        <h5
          className="sold d-flex justify-content-between text-content"
          style={{ color: "var(--theme-color)" }}
        >
          <span className="theme-color price">
            {convertCurrency(productDetail.sellingPrice- productDetail.discountAmount)}
          </span>

          {productDetail.discountAmount ? (
            <div className="d-flex gap-2">
              <Label className="modal-label text-danger mb-0">
                {productDetail.discountRate}%
              </Label>
            </div>
          ) : (
            ""
          )}
        </h5>
        {productDetail.discountAmount ? (
          <div className="d-flex gap-2">
            <del
              className="text-content text-secondary"
              style={{ color: "var(--theme-color)" }}
            >
              {convertCurrency(
                productDetail.sellingPrice
              )}
            </del>
          </div>
        ) : (
          ""
        )}

        {addAction && <ProductBox1Cart productObj={productDetail} />}
      </div>
    </div>
  );
};

export default ProductBox1;
