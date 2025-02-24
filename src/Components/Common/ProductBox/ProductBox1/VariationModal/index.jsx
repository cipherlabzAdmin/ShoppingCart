import { useState } from "react";
import { Col, Row } from "reactstrap";
import CustomModal from "@/Components/Common/CustomModal";
import LeftSideModal from "./LeftSideModal";
import RightVariationModal from "./RightSideModal";
import VariationModalQty from "./VariationModalQty";
import VariationAddToCart from "./VariationAddToCart";
import ProductAttribute from "@/Components/ProductDetails/Common/ProductAttribute/ProductAttribute";
import { t } from "i18next";

const VariationModal = ({ productObj, variationModal, setVariationModal }) => {
  const [cloneVariation, setCloneVariation] = useState({
    product: productObj,
    attributeValues: [],
    productQty: 1,
    selectedVariation: "",
    variantIds: [],
  });

  const quantity = cloneVariation?.product
    ? cloneVariation?.product?.quantity
    : "";

  const productInStock = cloneVariation?.product?.quantity > 0 ? true : false;

  //console.log(25, quantity);
  return (
    <CustomModal
      modal={productObj?.id == variationModal}
      setModal={setVariationModal}
      classes={{
        modalClass: "view-modal modal-lg theme-modal",
        modalHeaderClass: "p-0",
      }}
    >
      <Row className="g-sm-4 g-2">
        <LeftSideModal
          cloneVariation={cloneVariation}
          productObj={productObj}
        />
        <Col lg="6">
          <div className="right-sidebar-modal">
            <RightVariationModal cloneVariation={cloneVariation} />
            {cloneVariation?.product && productObj?.id == variationModal && (
              <ProductAttribute
                productState={cloneVariation}
                setProductState={setCloneVariation}
              />
            )}
            {!productInStock ? (
              <div style={{
                backgroundColor: "red",
                color: "white",
                padding: "5px 10px",
                fontSize: "12px",
                fontWeight: "bold",
                borderRadius: "3px",
                zIndex: 1,
              }} className="badge out-of-stock-badge">Out of Stock</div>
            ) : (
              ""
            )}
            <div className="modal-bottom-cart">
              <VariationModalQty
                cloneVariation={cloneVariation}
                setCloneVariation={setCloneVariation}
                quantity={quantity}
              />
              <VariationAddToCart
                cloneVariation={cloneVariation}
                setVariationModal={setVariationModal}
              />
            </div>
          </div>
        </Col>
      </Row>
    </CustomModal>
  );
};

export default VariationModal;
