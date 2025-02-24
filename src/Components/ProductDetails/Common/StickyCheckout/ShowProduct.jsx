import { useContext } from 'react';
import { Col, Row } from 'reactstrap';
import ProductDetailAction from '../ProductDetailAction';
import Avatar from '@/Components/Common/Avatar';
import { placeHolderImage } from '../../../../../Data/CommonPath';
import SettingContext from '@/Helper/SettingContext';
import ProductAttribute from '../ProductAttribute/ProductAttribute';

const ShowProduct = ({ productState, setProductState }) => {
  const { convertCurrency } = useContext(SettingContext);
  return (
    <div className='sticky-bottom-cart'>
      <div className='container-fluid-lg'>
        <Row>
          <Col xs={12}>
            <div className='cart-content'>
              <div className='product-image'>
                <Avatar
                  data={productState?.selectedVariation?.variation_image ?? productState?.product?.product_thumbnail}
                  placeHolder={placeHolderImage}
                  name={productState?.product ? productState?.product?.name : productState?.product?.name}
                />
                <div className='content'>
                  <h5>{productState?.product?.product?.name ? productState?.product?.product?.name : productState?.product?.product?.name}</h5>
                  <h6>
                    {productState?.product ? convertCurrency(productState?.product?.product?.sellingPrice) : convertCurrency(productState?.product?.product?.sellingPrice)}
                    {productState?.selectedVariation?.product?.discount ?? productState?.product?.product?.discount ? (
                      <>
                        <del className='text-danger'>{productState?.product?.product?.sellingPrice ? convertCurrency(productState?.product?.product?.sellingPrice) : convertCurrency(productState?.product?.product?.sellingPrice)}</del>
                        <span>{productState?.selectedVariation ? productState?.selectedVariation?.discount : productState?.product?.discount}% Off</span>
                      </>
                    ) : null}
                  </h6>
                </div>
              </div>
              <ProductAttribute productState={productState} setProductState={setProductState} stickyAddToCart={true} />
              <ProductDetailAction productState={productState} setProductState={setProductState} extraOption={false} />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ShowProduct;
