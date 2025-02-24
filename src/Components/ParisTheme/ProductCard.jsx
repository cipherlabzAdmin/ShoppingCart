import React, { useContext } from 'react';
import { Col } from 'reactstrap';
import ProductSection1 from './ProductSections/ProductSection1';
import ProductSection2 from './ProductSections/ProductSection2';
import ShowCaseBanner from './ShowCaseBanner';
import ProductSection3 from './ProductSections/ProductSection3';
import SingleBanner from './SingleBanner';
import TwoBanners from './TwoBanners';
import ProductSection4 from './ProductSections/ProductSection4';
import VegetableBanner from './VegetableBanner';
import FeatureBlog from './FeatureBlog';
import CustomHeading from '../Common/CustomHeading';
import { categorySliderOption, featureBlogSliderOption } from '../../../Data/SliderSettingsData';
import { LeafSVG } from '../Common/CommonSVG';
import ProductContext from '@/Helper/ProductContext';
import Banner from './ProductSections/Banner';

const ProductCard = ({ dataAPI }) => {
  const { products } = useContext(ProductContext);
  return (
    <Col xxl={dataAPI?.main_content?.sidebar?.status ? 12 : 12} xl={dataAPI?.main_content?.sidebar?.status ? 12 : 12}>
      {dataAPI?.main_content?.section1_products?.status && dataAPI?.main_content?.section1_products?.product_ids.length > 0 && (
        <ProductSection1
        title="Our Best Selling"
        fearchered={false}
          dataAPI={dataAPI?.main_content?.section1_products}
          ProductData={products}
          svgUrl={<LeafSVG className='icon-width' />}
          noCustomClass={true}
          classObj={{ productStyle: '', productBoxClass: 'product-box-3' }}
        />
      )}
      {dataAPI?.main_content?.section2_categories_list?.status && (
        <ProductSection2
          isHeadingVisible={true}
          dataAPI={dataAPI?.main_content?.section2_categories_list}
          svgUrl={<LeafSVG className='icon-width' />}
          classes={{ sliderOption: categorySliderOption }}
        />
      )}

      <Banner/>

      {/* {dataAPI?.main_content?.section3_two_column_banners?.status && <ShowCaseBanner dataAPI={dataAPI?.main_content?.section3_two_column_banners} />} */}
      {dataAPI?.main_content?.section4_products?.status && (
         <ProductSection1
         fearchered={true}
         title="Offers"
         dataAPI={dataAPI?.main_content?.section4_products}
         ProductData={products}
         svgUrl={<LeafSVG className='icon-width' />}
         noCustomClass={true}
         classObj={{ productStyle: '', productBoxClass: 'product-box-3' }}
       />
        // <ProductSection3 dataAPI={dataAPI?.main_content?.section4_products} ProductData={products} svgUrl={<LeafSVG className='icon-width' />} />
      )}
      {/* {dataAPI?.main_content?.section5_coupons?.status && (
        <SingleBanner
          classes={{ sectionClass: 'section-t-space sale-banner' }}
          image_url={dataAPI?.main_content?.section5_coupons?.image_url}
          height={138}
          width={1137}
          dataAPI={dataAPI?.main_content?.section5_coupons}
        />
      )} */}
      {/* {dataAPI?.main_content?.section6_two_column_banners?.status && <TwoBanners dataAPI={dataAPI} />} */}
      {/* {dataAPI?.main_content?.section7_products?.status && (
        <ProductSection4 dataAPI={dataAPI?.main_content?.section7_products} ProductData={products} svgUrl={<LeafSVG className='icon-width' />} noCustomClass={true} />
      )} */}
      {/* {dataAPI?.main_content?.section8_full_width_banner?.status && <VegetableBanner dataAPI={dataAPI} />} */}
      {/* {dataAPI?.main_content?.section9_featured_blogs?.status && (
        <>
          <CustomHeading
            title={dataAPI?.main_content?.section9_featured_blogs?.title}
            subTitle={dataAPI?.main_content?.section9_featured_blogs?.description}
            svgUrl={<LeafSVG className='icon-width' />}
            customClass='section-t-space title'
          />
          <FeatureBlog
            dataAPI={dataAPI?.main_content?.section9_featured_blogs}
            svgUrl={<LeafSVG className='icon-width' />}
            classes={{ sliderClass: 'slider-3-blog ratio_65 no-arrow product-wrapper', sliderOption: featureBlogSliderOption }}
          />
        </>
      )} */}
    </Col>
  );
};

export default ProductCard;
