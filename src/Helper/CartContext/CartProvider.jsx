import React, { useContext, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import CartContext from ".";
import { ToastNotification } from "@/Utils/CustomFunctions/ToastNotification";
import { AddToCartAPI } from "@/Utils/AxiosUtils/API";
import request from "@/Utils/AxiosUtils";
import { useQuery } from "@tanstack/react-query";
import ThemeOptionContext from "../ThemeOptionsContext";

const CartProvider = (props) => {
  const isCookie = Cookies.get("uat");
  const [cartProducts, setCartProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [variationModal, setVariationModal] = useState("");
  const [cartTotal, setCartTotal] = useState(0);
  const { setCartCanvas } = useContext(ThemeOptionContext);
  const [customer, setCustomer] = useState();
  const [discount, setDiscount] = useState();
  const isAuthString = Cookies.get("uat");
  const isAuth =
    isAuthString && isAuthString !== "ManagerLogin"
      ? JSON.parse(isAuthString)
      : null;

  useEffect(() => {
    if (isAuth !== "ManagerLogin" && isAuth) {
      setCustomer(isAuth);
    }
  }, []);

  // Getting data from Cart API
  const {
    data: CartAPIData,
    isLoading: getCartLoading,
    refetch,
  } = useQuery([AddToCartAPI], () => request({ url: AddToCartAPI }), {
    enabled: false,
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
  });

  // Refetching Cart API
  useEffect(() => {
    if (isCookie) {
      refetch();
    }
  }, [isCookie]);

  // Setting CartAPI data to state and LocalStorage
  useEffect(() => {
    const isCartAvaliable = JSON.parse(localStorage.getItem("cart"));

    if (isCartAvaliable?.items?.length > 0) {
      const discountSum =
        isCartAvaliable.items?.reduce((sum, item) => {
          const discount =
            (item.product?.discountAmount ?? 0) * (item.quantity ?? 1);
          return sum + discount;
        }, 0) || 0;

      setDiscount(discountSum);
    }

    if (isCookie) {
      if (isCartAvaliable?.items?.length > 0) {
        setCartProducts(isCartAvaliable?.items);
        setCartTotal(isCartAvaliable?.total);
      }
    } else {
      if (isCartAvaliable?.items?.length > 0) {
        setCartProducts(isCartAvaliable?.items);
        setCartTotal(isCartAvaliable?.total);
      }
    }
  }, [getCartLoading]);

  // Adding data in localstorage when not Login
  useEffect(() => {
    storeInLocalStorage();
  }, [cartProducts]);

  useEffect(() => {
    const transformedCart = cartProducts.map((item) => {
      const discountAmount = item.product.discountAmount || 0;
      const discountRate = item.product.discountRate || 0;
      const unitPrice = item.product.sellingPrice;
      const quantity = item.quantity || 1;
      const subTotal = item.sub_total || 0;
      const totalPrice = item.sub_total || 0;

      return {
        productId: item.product_id,
        productCode: item.product.code,
        productName: item.product.name,
        unitPrice,
        quantity,
        discountAmount: discountAmount * quantity,
        discountRate,
        totalPrice,
        eCommerceCustomerId: customer ? customer.id : "",
      };
    });

    setCartItems(transformedCart);
  }, [cartProducts]);

  // Getting total
  const total = useMemo(() => {
    return cartProducts?.reduce((prev, curr) => {
      return prev + Number(curr.sub_total);
    }, 0);
  }, [getCartLoading, cartProducts]);

  // Total Function for child components
  const getTotal = (value) => {
    return value?.reduce((prev, curr) => {
      return prev + Number(curr.sub_total) - Number(curr.product.discountAmount * curr.quantity);
    }, 0);
  };
  

  // Remove and Delete cart data from API and State
  const removeCart = (id, cartId) => {
    const updatedCart = cartProducts?.filter((item) => item.product_id !== id);
    setCartProducts(updatedCart);
  };

  // clear cart data State
  const clearCart = () => {
    setCartItems([]);
    setCartProducts([]);
    setCartTotal(0);
    // Additionally, you may want to clear localStorage if needed
    localStorage.removeItem("cart");
  };

  // Common Handler for Increment and Decerement
  const handleIncDec = (
    qty,
    productObj,
    isProductQty,
    setIsProductQty,
    isOpenFun,
    cloneVariation
  ) => {
    const cartUid = null;
    const updatedQty = isProductQty ? isProductQty : 0 + qty;
    const cart = [...cartProducts];
    const index = cart.findIndex((item) => item.product_id === productObj?.id);
    let tempProductId = productObj?.id;
    let tempVariantProductId = cloneVariation?.selectedVariation?.product_id;

    // Checking conditions for Replace Cart
    if (
      cart[index]?.variation &&
      cloneVariation?.variation_id &&
      tempProductId == tempVariantProductId &&
      cloneVariation?.variation_id !== cart[index]?.variation_id
    ) {
      return replaceCart(updatedQty, productObj, cloneVariation);
    }

    // Add data when not presence in Cart variable
    if (index === -1) {
      const params = {
        user: isAuth ? isAuth.id : null,
        id: null,
        product: productObj,
        product_id: productObj?.id,
        variation: cloneVariation?.selectedVariation
          ? cloneVariation?.selectedVariation
          : null,
        variation_id: cloneVariation?.selectedVariation?.id
          ? cloneVariation?.selectedVariation?.id
          : null,
        quantity: cloneVariation?.selectedVariation?.productQty
          ? cloneVariation?.selectedVariation?.productQty
          : updatedQty,
        sub_total: productObj?.sellingPrice
          ? updatedQty * productObj?.sellingPrice
          : updatedQty * productObj?.productObj?.sellingPrice,
      };
      isCookie
        ? setCartProducts((prev) => [...prev, params])
        : setCartProducts((prev) => [...prev, params]);
    } else {
      // Checking the Stock QTY of paricular product
      const productStockQty = cart[index]?.variation?.quantity
        ? cart[index]?.variation?.quantity
        : cart[index]?.product?.quantity;
      // if (productStockQty < cart[index]?.quantity + qty) {
      //   ToastNotification('error', `You can not add more items than available. In stock ${productStockQty} items.`);
      //   return false;
      // }

      if (cart[index]?.variation) {
        cart[index].variation.selected_variation = cart[
          index
        ]?.variation?.attribute_values
          ?.map((values) => values.value)
          .join("/");
      }

      const newQuantity = cart[index].quantity + qty;
      if (newQuantity < 1) {
        // Remove the item from the cart if the new quantity is less than 1
        return removeCart(productObj?.id, cartUid ? cartUid : cart[index].id);
      } else {
        cart[index] = {
          ...cart[index],
          id: cartUid?.id
            ? cartUid?.id
            : cart[index].id
            ? cart[index].id
            : null,
          quantity: newQuantity,
          sub_total:
            newQuantity *
            (cart[index]?.variation
              ? cart[index]?.variation?.sellingPrice
              : cart[index]?.product?.sellingPrice),
        };
        isCookie ? setCartProducts([...cart]) : setCartProducts([...cart]);
      }
    }
    // Update the productQty state immediately after updating the cartProducts state
    if (isCookie) {
      setIsProductQty && setIsProductQty(updatedQty);
      isOpenFun && isOpenFun(true);
    } else {
      setIsProductQty && setIsProductQty(updatedQty);
      isOpenFun && isOpenFun(true);
    }
    // setCartCanvas(true);
  };

  // Replace Cart
  const replaceCart = (updatedQty, productObj, cloneVariation) => {
    const cart = [...cartProducts];
    const index = cart.findIndex((item) => item.product_id === productObj?.id);
    cart[index].quantity = 0;

    const productQty = cart[index]?.variation
      ? cart[index]?.variation?.quantity
      : cart[index]?.product?.quantity;

    if (cart[index]?.variation) {
      cart[index].variation.selected_variation = cart[
        index
      ]?.variation?.attribute_values
        ?.map((values) => values.value)
        .join("/");
    }

    // Checking the Stock QTY of paricular product
    // if (productQty < cart[index]?.quantity + updatedQty) {
    //   ToastNotification('error', `You can not add more items than available. In stock ${productQty} items.`);
    //   return false;
    // }

    const params = {
      id: null,
      product: productObj,
      product_id: productObj?.id,
      variation: cloneVariation?.selectedVariation
        ? cloneVariation?.selectedVariation
        : null,
      variation_id: cloneVariation?.selectedVariation?.id
        ? cloneVariation?.selectedVariation?.id
        : null,
      quantity: cloneVariation?.productQty
        ? cloneVariation?.productQty
        : updatedQty,
      sub_total: productObj?.sellingPrice
        ? updatedQty * productObj?.sellingPrice
        : updatedQty * productObj?.sellingPrice,
    };

    isCookie
      ? setCartProducts((prevCartProducts) =>
          prevCartProducts.map((elem) => {
            if (
              elem?.product_id === cloneVariation?.selectedVariation?.product_id
            ) {
              return params;
            } else {
              return elem;
            }
          })
        )
      : setCartProducts((prevCartProducts) =>
          prevCartProducts.map((elem) => {
            if (
              elem?.product_id === cloneVariation?.selectedVariation?.product_id
            ) {
              return params;
            } else {
              return elem;
            }
          })
        );
  };

  // Setting data to localstroage when UAT is not there
  const storeInLocalStorage = () => {
    setCartTotal(total);
    localStorage.setItem(
      "cart",
      JSON.stringify({ items: cartProducts, total: total })
    );
  };

  return (
    <CartContext.Provider
      value={{
        ...props,
        cartProducts,
        cartItems,
        setCartProducts,
        cartTotal,
        setCartTotal,
        removeCart,
        clearCart,
        getTotal,
        handleIncDec,
        variationModal,
        setVariationModal,
        replaceCart,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
