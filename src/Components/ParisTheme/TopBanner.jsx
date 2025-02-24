import { Col, Row } from 'reactstrap';
import WrapperComponent from '../Common/WrapperComponent';
import OfferBanner from './OfferBanner';
import SkeletonWrapper from '../Common/SkeletonWrapper';
import RatioImage from '@/Utils/RatioImage';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {BannerImage, BannerImage3, BannerImage4, BannerImage5, BannerImage6, BannerImage7, BannerImage8, BannerImage9} from '../../../Data/CommonPath';
import {BannerImage1} from '../../../Data/CommonPath';
import {BannerImage2} from '../../../Data/CommonPath';
import Image from 'next/image';

const TopBanner = ({ dataAPI }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };
  return (  
      <WrapperComponent classes={{ sectionClass: 'home-section pt-2', row: 'g-4' }} customCol={true}>
         <Slider {...settings}>
        <SkeletonWrapper
          classes={{ colProps: { xl: 12 }, colClass: 'ratio_65', divClass: 'home-contain h-80 skeleton-banner-xl' }}
        >
          <div className={`home-contain hover-effect`}>
            {/* <img src={BannerImage} className='bg-img' alt='banner' /> */}
            <Image src={BannerImage} className='bg-img' style={{width:'100%' ,backgroundPosition: 'center center',backgroundSize: 'cover'}}/>
          </div>
        </SkeletonWrapper>
        <SkeletonWrapper
          classes={{ colProps: { xl: 12 }, colClass: 'ratio_65', divClass: 'home-contain h-80 skeleton-banner-xl' }}
        >
          <div className={`home-contain hover-effect`}>
            {/* <img src={BannerImage} className='bg-img' alt='banner' /> */}
            <Image src={BannerImage1} className='bg-img' style={{width:'100%' ,backgroundPosition: 'center center',backgroundSize: 'cover'}}/>
          </div>
        </SkeletonWrapper>
        <SkeletonWrapper
          classes={{ colProps: { xl: 12 }, colClass: 'ratio_65', divClass: 'home-contain h-80 skeleton-banner-xl' }}
        >
          <div className={`home-contain hover-effect`}>
            {/* <img src={BannerImage} className='bg-img' alt='banner' /> */}
            <Image src={BannerImage3} className='bg-img' style={{width:'100%' ,backgroundPosition: 'center center',backgroundSize: 'cover'}}/>
          </div>
        </SkeletonWrapper>
        <SkeletonWrapper
          classes={{ colProps: { xl: 12 }, colClass: 'ratio_65', divClass: 'home-contain h-80 skeleton-banner-xl' }}
        >
          <div className={`home-contain hover-effect`}>
            {/* <img src={BannerImage} className='bg-img' alt='banner' /> */}
            <Image src={BannerImage4} className='bg-img' style={{width:'100%' ,backgroundPosition: 'center center',backgroundSize: 'cover'}}/>
          </div>
        </SkeletonWrapper>
        <SkeletonWrapper
          classes={{ colProps: { xl: 12 }, colClass: 'ratio_65', divClass: 'home-contain h-80 skeleton-banner-xl' }}
        >
          <div className={`home-contain hover-effect`}>
            {/* <img src={BannerImage} className='bg-img' alt='banner' /> */}
            <Image src={BannerImage5} className='bg-img' style={{width:'100%' ,backgroundPosition: 'center center',backgroundSize: 'cover'}}/>
          </div>
        </SkeletonWrapper>
        <SkeletonWrapper
          classes={{ colProps: { xl: 12 }, colClass: 'ratio_65', divClass: 'home-contain h-80 skeleton-banner-xl' }}
        >
          <div className={`home-contain hover-effect`}>
            {/* <img src={BannerImage} className='bg-img' alt='banner' /> */}
            <Image src={BannerImage6} className='bg-img' style={{width:'100%' ,backgroundPosition: 'center center',backgroundSize: 'cover'}}/>
          </div>
        </SkeletonWrapper>
        <SkeletonWrapper
          classes={{ colProps: { xl: 12 }, colClass: 'ratio_65', divClass: 'home-contain h-80 skeleton-banner-xl' }}
        >
          <div className={`home-contain hover-effect`}>
            {/* <img src={BannerImage} className='bg-img' alt='banner' /> */}
            <Image src={BannerImage7} className='bg-img' style={{width:'100%' ,backgroundPosition: 'center center',backgroundSize: 'cover'}}/>
          </div>
        </SkeletonWrapper>
        <SkeletonWrapper
          classes={{ colProps: { xl: 12 }, colClass: 'ratio_65', divClass: 'home-contain h-80 skeleton-banner-xl' }}
        >
          <div className={`home-contain hover-effect`}>
            {/* <img src={BannerImage} className='bg-img' alt='banner' /> */}
            <Image src={BannerImage8} className='bg-img' style={{width:'100%' ,backgroundPosition: 'center center',backgroundSize: 'cover'}}/>
          </div>
        </SkeletonWrapper>
        <SkeletonWrapper
          classes={{ colProps: { xl: 12 }, colClass: 'ratio_65', divClass: 'home-contain h-80 skeleton-banner-xl' }}
        >
          <div className={`home-contain hover-effect`}>
            {/* <img src={BannerImage} className='bg-img' alt='banner' /> */}
            <Image src={BannerImage9} className='bg-img' style={{width:'100%' ,backgroundPosition: 'center center',backgroundSize: 'cover'}}/>
          </div>
        </SkeletonWrapper>
        </Slider>
      </WrapperComponent>


    // <WrapperComponent classes={{ sectionClass: 'home-section pt-2', row: 'g-4' }} customCol={true}>
    //    <Slider {...settings}>
    //    <SkeletonWrapper classes={{ colProps: { xl: 12 }, colClass: 'ratio_65', divClass: 'home-contain h-80 skeleton-banner-xl' }}>
    //   <div className={`home-contain hover-effect`}>
    //   <RatioImage src={dataAPI?.home_banner?.main_banner?.image_url} className='bg-img' alt='banner' />
    //       </div>
    //   </SkeletonWrapper>
    //    </Slider>
     

    //   {/* <Col xl={4} className='ratio_65'>
    //     <Row className='g-4'>
    //       <SkeletonWrapper classes={{ colProps: { xl: 12, md: 6 }, colClass: 'skeleton-banner-sm', divClass: 'home-contain' }}>
    //         <OfferBanner classes={{ customHoverClass: 'home-contain' }} imgUrl={dataAPI?.home_banner?.sub_banner_1?.image_url} ratioImage={true} elem={dataAPI?.home_banner?.sub_banner_1} />
    //       </SkeletonWrapper>

    //       <SkeletonWrapper classes={{ colProps: { xl: 12, md: 6 }, colClass: 'skeleton-banner-sm', divClass: 'home-contain' }}>
    //         <OfferBanner classes={{ customHoverClass: 'home-contain' }} imgUrl={dataAPI?.home_banner?.sub_banner_2?.image_url} ratioImage={true} elem={dataAPI?.home_banner?.sub_banner_2} />
    //       </SkeletonWrapper>
    //     </Row>
    //   </Col> */}
    // </WrapperComponent>
  );
};

export default TopBanner;
