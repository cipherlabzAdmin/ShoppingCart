import Link from "next/link";
import { placeHolderImage } from "../../../Data/CommonPath";
import HandleQuantity from "./HandleQuantity";
import Avatar from "../Common/Avatar";
import { useContext } from "react";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import SettingContext from "@/Helper/SettingContext";

const CartProductDetail = ({ elem }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const { convertCurrency } = useContext(SettingContext);

  //console.log(elem);
  return (
    <td className="product-detail" style={{ paddingTop: "2vw" }}>
      <div className="product border-0">
        <Link
          href={`/${i18Lang}/product/${elem?.product?.id}`}
          className="product-image"
        >
          <Avatar
            customImageClass={"img-fluid"}
            data={elem.product.imageURL}
            placeHolder={placeHolderImage}
            name={elem?.product?.name}
          />
        </Link>
        <div className="product-detail">
          <ul>
            <li
              style={{
                width: "250px",
                wordBreak: "break-word",
                overflowWrap: "break-word", // Ensure words break properly
                whiteSpace: "normal", // Ensure the text wraps to the next line
              }}
              className="name"
            >
              <Link href={`/${i18Lang}/product/${elem?.product?.id}`}>
                {elem?.variation?.name ?? elem?.product?.name}
              </Link>
            </li>

            <li
              style={{ color: "var(--theme-color)" }}
              className="text-content"
            >
              <span className="text-title">{t("SoldBy")} : </span>{" "}
              {t("Fastkart")}
            </li>

            {/* <li
              style={{ color: "var(--theme-color)" }}
              className="text-content"
            >
              <span className="text-title">{t("Unit")}</span> :{" "}
              {elem?.variation?.unit ?? elem?.product?.unit}
            </li> */}

            {/* <li>
              <h5
                className="text-content d-inline-block"
                style={{ color: "var(--theme-color)" }}
              >
                {t("Price")} :
              </h5>
              <span>{convertCurrency(elem?.product?.sellingPrice)}</span>
              <span
                className="text-content"
                style={{ color: "var(--theme-color)" }}
              >
                {convertCurrency(elem?.variation?.sellingPrice) ??
                  convertCurrency(elem?.product?.sellingPrice)}
              </span>
            </li> */}

            {/* <li>
              <h5 className="saving theme-color">
                {t("Saving")} :{" "}
                {convertCurrency(
                  Number(
                    (elem?.variation?.price ?? elem?.product?.price) -
                      (elem?.variation?.sale_price ?? elem?.product?.sale_price)
                  )
                )}
              </h5>
            </li> */}

            {/* <HandleQuantity
              productObj={elem?.product}
              elem={elem}
              classes={{ customClass: "quantity-price-box" }}
            /> */}

            {/* <li>
              <h5>
                {t("Total")}: ${elem?.sub_total}
              </h5>
            </li> */}
          </ul>
        </div>
      </div>
    </td>
  );
};

export default CartProductDetail;
