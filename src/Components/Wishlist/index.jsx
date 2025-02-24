"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Col } from "reactstrap";
import Breadcrumb from "../Common/Breadcrumb";
import WrapperComponent from "../Common/WrapperComponent";
import ProductBox1 from "../Common/ProductBox/ProductBox1/ProductBox1";
import { WishlistAPI } from "@/Utils/AxiosUtils/API";
import request from "@/Utils/AxiosUtils";
import Loader from "@/Layout/Loader";

const WishlistContent = () => {
  const [wishlistState, setWishlistState] = useState([]);
  const { data, isLoading, refetch } = useQuery(
    [WishlistAPI],
    () => request({ url: WishlistAPI }),
    { enabled: true, refetchOnWindowFocus: false, select: (res) => res?.data }
  );
  useEffect(() => {
    if (data?.data) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      setWishlistState([...data?.data]);
    }
  }, [data?.data]);
  if (isLoading) return <Loader />;
  return (
    <>
      <Breadcrumb title={"Wishlist"} subNavigation={[{ name: "Wishlist" }]} />

      <WrapperComponent
        classes={{
          sectionClass: "wishlist-section section-b-space",
          row: "g-sm-3 g-2",
        }}
        customCol={true}
      >
        {wishlistState?.map((product) => (
          <Col
            xxl={2}
            lg={3}
            md={4}
            xs={6}
            className="product-box-contain"
            key={product.id}
          >
            <ProductBox1
              imgUrl={product?.product_thumbnail}
              productDetail={product}
              isClose={true}
              refetch={refetch}
              classObj={{ productBoxClass: "product-box-3" }}
              setWishlistState={setWishlistState}
            />
          </Col>
        ))}
      </WrapperComponent>
    </>
  );
};

export default WishlistContent;
