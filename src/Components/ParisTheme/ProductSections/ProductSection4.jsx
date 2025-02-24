import { useMemo } from 'react';
import CustomHeading from '@/Components/Common/CustomHeading';
import ProductBox2 from '@/Components/Common/ProductBox/ProductBox2/ProductBox2';

const ProductSection4 = ({ dataAPI, ProductData, svgUrl, noCustomClass, customClass }) => {
  // const filterProduct = useMemo(() => {
  //   return ProductData?.filter((el) => dataAPI?.product_ids?.includes(el.id));
  // }, [ProductData, dataAPI]);
  return (
    <>
      <CustomHeading title={dataAPI?.title} svgUrl={svgUrl} subTitle={dataAPI?.description} customClass={customClass ? customClass : noCustomClass ? '' : 'section-t-space title'} />
      <div className='best-selling-slider product-wrapper'>
        <div className='position-relative'>
          <span className='border-effect'></span>
          <ul className='product-list'>
            {ProductData?.map((elem, index) => (
              <li key={index}>
                <ProductBox2 elem={elem} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProductSection4;
