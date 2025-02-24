import { useEffect, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import Slider from 'react-slick';
import CustomHeading from '@/Components/Common/CustomHeading';
import { productSliderOption } from '../../../../Data/SliderSettingsData';
import ProductBox1 from '@/Components/Common/ProductBox/ProductBox1/ProductBox1';

const ProductSection1 = ({fearchered,title, dataAPI, ProductData, svgUrl, noCustomClass = false, customClass, classObj, customSliderOption = productSliderOption, isHeadingVisible = true }) => {

  return (
    <>
      {isHeadingVisible ? (
        <CustomHeading title={title} svgUrl={svgUrl} subTitle={dataAPI?.description} customClass={customClass ? customClass : noCustomClass ? '' : 'section-t-space title'} />
      ) : null}
      <div >
        <div className='no-arrow'>
        <Row xxl={5} xl={5} lg={5} md={3} xs={2} className={`g-sm-4 g-3 product-list-section`}>
          {ProductData.length > 0 && ProductData?.slice(0, 5).map((product, i) => (
            <Col key={i}>
              <ProductBox1 fearcher = {fearchered} imgUrl={product?.product_thumbnail} productDetail={{ ...product }} classObj={{ productBoxClass: 'product-box-3' }} />
            </Col>
          ))}
        </Row>
          {/* <Slider {...customSliderOption}>
            {ProductData?.map((elem) => (
              <div key={elem?.id}>
                <Row className='m-0'>
                  <Col xs={12} className='px-0'>
                    <ProductBox1 imgUrl={elem?.image} productDetail={{ ...elem }} classObj={classObj} />
                  </Col>
                </Row>
              </div>
            ))}
          </Slider> */}
        </div>
      </div>
    </>
  );
};

export default ProductSection1;
