import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import request from "../../AxiosUtils";
import { VerifyTokenAPI } from "../../AxiosUtils/API";
import { ToastNotification } from "../../CustomFunctions/ToastNotification";
import { useState, useEffect, useContext} from "react";
import CartContext from "@/Helper/CartContext";
import I18NextContext from '@/Helper/I18NextContext';
const baseUrl = process?.env?.API_BASE_URL;

const useOtpVerification = () => {
const router = useRouter();
const [customer, setCustomer] = useState();
const { cartProducts } = useContext(CartContext);
const { i18Lang } = useContext(I18NextContext);

const isAuthString = Cookies.get("uatTemp");
  const isAuth = isAuthString ? JSON.parse(isAuthString) : null;

  const isAuthCusString = Cookies.get("cusTemp");
  const isAuthCus = isAuthCusString ? JSON.parse(isAuthCusString) : null;

useEffect(() => {
  if(isAuth){
    setCustomer(isAuth);
  } 
  else if(isAuthCus){
    setCustomer(isAuthCus);
  }
}, [])

  return useMutation((data) => request({ url: `${baseUrl}services/common/sms/VerifyUserPhoneNumberByOTP?customerId=${customer && customer.id}&code=${data.token}`, method: "post" }), {
    onSuccess: (responseData, requestData) => {
      if (responseData.data.success) {
        if(responseData.data.result == "Phone number Verified"){
           
          
            if(isAuthCus){
               localStorage.setItem('customerDetails', JSON.stringify(isAuthCus));
               router.push(`/${i18Lang}/account/dashboard`);
               ToastNotification("success", `Customer ${customer.firstName} Selected Successfully!`);
             
            }else{
              
              Cookies.set('uat', JSON.stringify(isAuth), { path: '/', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
             
              if(cartProducts.length > 0){
                router.push(`/${i18Lang}/checkout`);
                ToastNotification("success", `User Verified Successfully!`);
              }else{
                router.push(`/${i18Lang}/account/dashboard`);
                ToastNotification("success", `User Verified Successfully!`);
              }
            }
             
           
        }else{
           ToastNotification("error", responseData.data.result);
        }
        // Cookies.set('uo', requestData?.token)
        // router.push("/auth/update-password");
        // ToastNotification("success", responseData.data.message);
      }
    },
  });
};
export default useOtpVerification;
