"use client";
import { useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/Layout/Loader";
import request from "@/Utils/AxiosUtils";
import { ProductAPI } from "@/Utils/AxiosUtils/API";
import Breadcrumb from "../Common/Breadcrumb";
import Product4Image from "./Product4Image";
import RelatedProduct from "./Common/RelatedProduct";
import ProductThumbnail from "./ProductThumbnail";
import ProductSlider from "./ProductSlider";
import ProductSticky from "./ProductSticky";
import ThemeOptionContext from "@/Helper/ThemeOptionsContext";
import { useRouter, useSearchParams } from "next/navigation";
import ProductIdsContext from "@/Helper/ProductIdsContext";
import StickyCheckout from "./Common/StickyCheckout";
import CartContext from "@/Helper/CartContext";

const baseUrl = process?.env?.API_BASE_URL;

const ProductDetailContent = ({ params }) => {
  const router = useRouter();
  const storedWarehouse = JSON.parse(localStorage.getItem("selectedWarehouse"));
  const { themeOption } = useContext(ThemeOptionContext);
  const { cartProducts } = useContext(CartContext);
  const { setGetProductIds, isLoading: productLoader } =
    useContext(ProductIdsContext);
  const [productDetails, setProductDetails] = useState([]);
  const searchParams = useSearchParams();
  const queryProductLayout = searchParams.get("layout");

  // Determine Product Layout
  const isProductLayout = useMemo(
    () =>
      queryProductLayout ||
      themeOption?.product?.product_layout ||
      "product_thumbnail",
    [queryProductLayout, themeOption]
  );

  const [productState, setProductState] = useState({
    product: [],
    attributeValues: [],
    productQty: 1,
    selectedVariation: "",
    variantIds: [],
  });

  // Fetch Product API Data
  const {
    data: ProductData,
    isLoading,
    refetch,
  } = useQuery(
    ["product", params],
    () => request({ url: `${ProductAPI}/${params}` }, router),
    {
      enabled: !!params,
      refetchOnWindowFocus: false,
      select: (res) => res?.data,
    }
  );

  // Refetch product data on params change
  useEffect(() => {
    if (params) refetch();
  }, [params]);

  // Update state and related product IDs when ProductData changes
  useEffect(() => {
    if (ProductData) {
      const relatedIds = [
        ...(ProductData.cross_sell_products || []),
        ...(ProductData.related_products || []),
      ];
      if (relatedIds.length > 0) {
        setGetProductIds({ ids: [...new Set(relatedIds)].join(",") });
      }
      setProductState({ ...productState, product: productDetails });
    }
  }, [ProductData, setGetProductIds, productDetails]);

  // Fetch additional product details using POST
  useEffect(() => {
    const fetchDetails = async () => {
      if (!params) return;
      try {
        const response = await fetch(`${baseUrl}services/app/product/Get`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: params , warehouseId: storedWarehouse.id }),
        });

        const result = await response.json();
        setProductDetails(result.result);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchDetails();
  }, [params]);

  // Handle scroll for stickyCart class
  useEffect(() => {
    const handleScroll = () => {
      const button = document.querySelector(".scroll-button");
      if (button) {
        const buttonRect = button.getBoundingClientRect();
        if (buttonRect.bottom < 0) {
          document.body.classList.add("stickyCart");
        } else {
          document.body.classList.remove("stickyCart");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove("stickyCart");
    };
  }, []);

  if (isLoading) return <Loader />;

  // Product Layout Components
  const showProductLayout = {
    product_thumbnail: (
      <ProductThumbnail
        productState={productState}
        setProductState={setProductState}
      />
    ),
    product_images: (
      <Product4Image
        productState={productState}
        setProductState={setProductState}
      />
    ),
    product_sticky: (
      <ProductSticky
        productState={productState}
        setProductState={setProductState}
      />
    ),
    product_slider: (
      <ProductSlider
        productState={productState}
        setProductState={setProductState}
      />
    ),
    product_accordion: (
      <ProductThumbnail
        productState={productState}
        setProductState={setProductState}
        customTab={true}
      />
    ),
  };

  return (
    <>
      <Breadcrumb
        title={productDetails.name}
        subNavigation={[{ name: "Product" }, { name: productDetails.name }]}
      />
      {showProductLayout[isProductLayout]}
      {productState.product.related_products?.length > 0 && (
        <RelatedProduct productState={productState} />
      )}
      <StickyCheckout ProductData={productState} isLoading={isLoading} />
    </>
  );
};

export default ProductDetailContent;
