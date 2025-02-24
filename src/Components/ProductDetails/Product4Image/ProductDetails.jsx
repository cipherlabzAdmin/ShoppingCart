import { useContext } from 'react';
import I18NextContext from '@/Helper/I18NextContext';
import { useTranslation } from '@/app/i18n/client';
import ProductBox1Rating from '@/Components/Common/ProductBox/ProductBox1/ProductBox1Rating';
import CustomerOrderCount from '../Common/CustomerOrderCount';
import SettingContext from '@/Helper/SettingContext';

const ProductDetails = ({ productState }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');
  const { convertCurrency } = useContext(SettingContext);


  return (
    <>
      <CustomerOrderCount productState={productState} />
      <h2 className='name'>{productState?.product?.name ?? productState?.product?.name}</h2>
      <div className='price-rating'>
        <h3 className='theme-color price'>
          {productState?.product?.sellingPrice ? convertCurrency(productState?.product?.sellingPrice) : convertCurrency(productState?.product?.sellingPrice)}
          <del className='text-content' style={{color: 'var(--theme-color)'}}>{productState?.product?.discountAmount ? convertCurrency(productState?.product?.sellingPrice + productState?.product?.discountAmount) : ''}</del>
          {productState?.selectedVariation?.discount || productState?.product?.discount ? (
            <span className='offer-top'>
              {productState?.selectedVariation ? productState?.selectedVariation?.discount : productState?.product?.discount}% {t('Off')}
            </span>
          ) : null}
        </h3>
        <div className='product-rating custom-rate'>
          <ProductBox1Rating totalRating={productState?.selectedVariation?.rating_count ?? productState?.product?.rating_count} />
          <span className='review'>
            {productState?.selectedVariation?.reviews_count || productState?.product?.reviews_count || 0} {t('Review')}
          </span>
        </div>
      </div>
      <div className='product-contain'>
        <p>{productState?.product?.description ?? productState?.product?.description}</p>
      </div>
    </>
  );
};

export default ProductDetails;
