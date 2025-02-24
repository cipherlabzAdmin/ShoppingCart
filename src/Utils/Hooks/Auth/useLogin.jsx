import { useMutation } from "@tanstack/react-query";
import request from "../../AxiosUtils";
import {
  emailSchema,
  passwordSchema,
  phoneSchema,
  YupObject,
} from "../../Validation/ValidationSchemas";
import { LoginAPI } from "../../AxiosUtils/API";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import I18NextContext from "@/Helper/I18NextContext";
import Cookies from "js-cookie";
import AccountContext from "@/Helper/AccountContext";
import CompareContext from "@/Helper/CompareContext";
import { ToastNotification } from "../../../Utils/CustomFunctions/ToastNotification";
import CartContext from "@/Helper/CartContext";
const baseUrl = process?.env?.API_BASE_URL;

export const LogInSchema = YupObject({
  emailAddress: emailSchema,
  password: passwordSchema,
});

export const LogInSchemaTp = YupObject({
  phone: phoneSchema,
  password: passwordSchema,
});

const LoginHandle = (
  responseData,
  router,
  i18Lang,
  refetch,
  compareRefetch,
  cartProducts,
  rSelected,
  tp
) => {
  if (responseData.status === 200 || responseData.status === 201) {
    if (responseData.data?.result) {
      Cookies.remove("uatTemp");
      Cookies.remove("cusTemp");
      Cookies.set("uatTemp", JSON.stringify(responseData.data?.result), {
        path: "/",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      if (rSelected.rSelected == 1) {
        router.push(`/${i18Lang}/auth/otp-verification`);
      } else {
        router.push(`/${i18Lang}/auth/otp-verification?tp=${tp}`);
      }
    } else {
      ToastNotification("error", "Invalid login details. Please try again!");
    }
  }
};

const useHandleLogin = (rSelected) => {
  const { i18Lang } = useContext(I18NextContext);
  const { refetch } = useContext(AccountContext);
  const { refetch: compareRefetch } = useContext(CompareContext);
  const { cartProducts, setCartProducts } = useContext(CartContext);
  const [tp, setTp] = useState();

  const router = useRouter();
  return useMutation(
    (data) => {
      // Specify the fields you want to keep in the modifiedData object
      if (data.phone) {
        setTp(data.phone);
      }

      const newDataEmail = {
        emailAddress: data.emailAddress,
        password: data.password,
        userType: 2,
      };

      const newDataTp = {
        emailAddress: data.country_code + data.phone,
        password: data.password,
        userType: 2,
      };

      return request({
        url: `${baseUrl}services/ecommerce/eCommerceCustomerAccount/Login`,
        method: "post",
        data: rSelected.rSelected == 1 ? newDataEmail : newDataTp,
      });
    },
    {
      onSuccess: (responseData) => {
        localStorage.setItem('userType',2);
        if (cartProducts.length > 0 && cartProducts[0]?.user != null && responseData.data.result.id !== cartProducts[0].user) {
          setCartProducts([]);
        }        
        LoginHandle(
          responseData,
          router,
          i18Lang,
          refetch,
          compareRefetch,
          cartProducts,
          rSelected,
          tp
        );
      },
      onError: (responseData) =>
        ToastNotification("error", responseData.error.message),
    }
  );
};

export default useHandleLogin;
