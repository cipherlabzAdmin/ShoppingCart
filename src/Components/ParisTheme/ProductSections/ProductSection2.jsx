import React, { useContext } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import CustomHeading from '@/Components/Common/CustomHeading';
import Avatar from '@/Components/Common/Avatar';
import { placeHolderImage1 } from '../../../../Data/CommonPath';
import placeholderImg1 from '../../../../public/assets/images/placeholder1.png';
import CategoryContext from '@/Helper/CategoryContext';
import { useTranslation } from '@/app/i18n/client';
import I18NextContext from '@/Helper/I18NextContext';

const ProductSection2 = ({ dataAPI, isHeadingVisible = false, classes = {}, svgUrl }) => {
  const { filterCategory } = useContext(CategoryContext);
  const { category } = useContext(CategoryContext);
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');
  const categoryData = filterCategory('product');
  return (
    <>
      {isHeadingVisible ? <CustomHeading customClass={classes?.noCustomClass ? '' : 'section-t-space title'} title={dataAPI?.title} svgUrl={svgUrl} subTitle={dataAPI?.description} /> : ''}

      <div className='category-slider-2 product-wrapper no-arrow' style={{marginBottom:'20px'}}>
        <Slider {...classes?.sliderOption}>
          {category.length > 0 && category?.map((elem) => (
            <div key={elem.id}>
              <Link href={`/${i18Lang}/collections?category=${elem?.name}`} className={`category-box ${classes?.link} category-dark`}>
                <div>
                  <Avatar data={elem?.category_icon} placeHolder={placeholderImg1} name={elem.name} />
                  <h5>{elem.name}</h5>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default ProductSection2;
