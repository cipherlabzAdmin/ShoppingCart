import { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import { Col, Row } from "reactstrap";
import { productDetailSlider } from "../../../../Data/SliderSettingsData";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import { placeHolderImage } from "../../../../Data/CommonPath";

const ProductThumbnailSlider = ({ productState }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const [state, setState] = useState({ nav1: null, nav2: null });
  const slider1 = useRef();
  const slider2 = useRef();
  const { nav1, nav2 } = state;
  useEffect(() => {
    setState({
      nav1: slider1.current,
      nav2: slider2.current,
    });
  }, []);

  return (
    <Col xl={6}>
      <div className="product-left-box">
        <Row className="g-2">
          <Col xs={12}>
            <div className="product-main-1">
              {productState?.product?.is_sale_enable ? (
                <div className="product-label-tag">
                  <span>{t("SALE")}</span>
                </div>
              ) : productState?.product?.is_featured ? (
                <div className="product-label-tag warning-label-tag">
                  <span>{t("Featured")}</span>
                </div>
              ) : null}
              <Slider
                asNavFor={nav2}
                ref={(slider) => (slider1.current = slider)}
              >
                <div>
                  <div className="slider-image">
                    <Image
                      height={200}
                      width={200}
                      src={
                        productState.product.imageURL
                          ? productState.product.imageURL
                          : ""
                      }
                      className="img-fluid"
                      alt={"name"}
                    />
                  </div>
                </div>
                <div>
                  <div className="slider-image">
                    <Image
                      height={200}
                      width={200}
                      src={
                        productState.product.imageURL
                          ? productState.product.imageURL
                          : ""
                      }
                      className="img-fluid"
                      alt={"name"}
                    />
                  </div>
                </div>
              </Slider>
            </div>
          </Col>

          <Col xs={12}>
            <div className="bottom-slider-image left-slider slick-top no-arrow">
              <Slider slidesToShow={3}>
                <div>
                  <div className="sidebar-image">
                    <Image
                      height={130}
                      width={130}
                      src={
                        productState.product.imageURL
                          ? productState.product.imageURL
                          : ""
                      }
                      className="img-fluid"
                      alt={"name"}
                    />
                  </div>
                </div>
                <div>
                  <div className="sidebar-image">
                    <Image
                      height={130}
                      width={130}
                      src={
                        productState.product.imageURL
                          ? productState.product.imageURL
                          : ""
                      }
                      className="img-fluid"
                      alt={"name"}
                    />
                  </div>
                </div>
                <div>
                  <div className="sidebar-image">
                    <Image
                      height={130}
                      width={130}
                      src={
                        productState.product.imageURL
                          ? productState.product.imageURL
                          : ""
                      }
                      className="img-fluid"
                      alt={"name"}
                    />
                  </div>
                </div>
              </Slider>
            </div>
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default ProductThumbnailSlider;
