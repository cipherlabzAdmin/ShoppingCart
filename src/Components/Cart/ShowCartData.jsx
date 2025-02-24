import React, { useContext } from "react";
import CartSidebar from "./CartSidebar";
import { Col, Table } from "reactstrap";
import CartData from "./CartData";
import CartContext from "@/Helper/CartContext";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import NoDataFound from "../Common/NoDataFound";
import emptyImage from "../../../public/assets/svg/empty-items.svg";
import CartLeftbar from "./CartLeftbar";

const ShowCartData = () => {
  const { cartProducts } = useContext(CartContext);
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  return (
    <>
      {cartProducts?.length > 0 ? (
        <>
          <CartLeftbar />
          <Col xxl={6} xl={8}>
            <div
              className="cart-table pt-0 px-0"
              style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }} >
              <div className="table-responsive">
                <Table className="table">
                  <thead>
                    <tr>
                      <th
                        style={{
                          background: "var(--theme-color)",
                          color: "white",
                          padding: "1vw",
                          borderTopLeftRadius: "10px",
                        }}
                      >
                        Product
                      </th>
                      <th
                        style={{
                          background: "var(--theme-color)",
                          padding: "1vw",
                          color: "white",
                        }}
                      >
                        Price
                      </th>
                      <th
                        style={{
                          background: "var(--theme-color)",
                          padding: "1vw",
                          color: "white",
                        }}
                      >
                        Qty
                      </th>
                      <th
                        style={{
                          background: "var(--theme-color)",
                          padding: "1vw",
                          color: "white",
                        }}
                      >
                        Total
                      </th>
                      <th
                        style={{
                          background: "var(--theme-color)",
                          padding: "1vw",
                          color: "white",
                          borderTopRightRadius: "10px",
                        }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartProducts.map((elem, i) => (
                      <CartData elem={elem} key={i} />
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
          <CartSidebar />
        </>
      ) : (
        <NoDataFound
          data={{
            customClass: "no-data-added",
            imageUrl: emptyImage,
            title: "No Items Added",
            description:
              "It appears that nothing has been added to your cart. Explore categories if you want to.",
            height: 50,
            width: 50,
          }}
        />
      )}
    </>
  );
};

export default ShowCartData;
