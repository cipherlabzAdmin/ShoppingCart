import { useMutation } from "@tanstack/react-query";
import request from "../../AxiosUtils";
import {
  emailSchema,
  usernameSchema,
  passwordSchema,
  YupObject,
} from "../../Validation/ValidationSchemas";
import { LoginAPI } from "../../AxiosUtils/API";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import I18NextContext from "@/Helper/I18NextContext";
import Cookies from "js-cookie";
import AccountContext from "@/Helper/AccountContext";
import CompareContext from "@/Helper/CompareContext";
import { ToastNotification } from "../../CustomFunctions/ToastNotification";
const baseUrl = process?.env?.API_BASE_URL;

export const AdminLogInSchema = YupObject({
  username: usernameSchema,
  password: passwordSchema,
});

const fetchCurrentUser = async (token) => {
  try {
    const response = await request({
      url: `${baseUrl}services/app/user/getCurrentUser`,
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data?.result);
    return response.data?.result;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

const AdminLoginHandle = async (responseData, router, i18Lang) => {
  if (responseData.status === 200 || responseData.status === 201) {
    const result = responseData.data?.result;
    if (result) {
      try {
        const currentUser = await fetchCurrentUser(result);
        const userData = {
          userName: currentUser.userName,
          emailAddress: currentUser.emailAddress,
          fullName: currentUser.fullName,
          warehouseId: currentUser.warehouseId,
          id: currentUser.id,
          userType: currentUser.userType
        };
        Cookies.remove("uatTemp");
        Cookies.set("uatTemp", JSON.stringify(currentUser), {
          path: "/",
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        }); 
        // router.push(`/${i18Lang}/auth/otp-verification?tp=${tp}`);
        if (currentUser.userType == 5) {
          router.push(`/${i18Lang}/theme/paris`);
        } else {
          router.push(`/${i18Lang}/theme/paris`);
        }
      } catch (error) {
        console.log("fetchCurrentUser Failed", error)
      }

    } else {
      ToastNotification("error", "Failed to fetch user details. Please try again!");
    }
  } else {
    console.log(responseData.response?.data);
    ToastNotification("error", "Invalid login details. Please try again!");
  }
};

const useHandleAdminLogin = () => {
  const { i18Lang } = useContext(I18NextContext);
  const router = useRouter();
  return useMutation(
    (data) => {
      const newDataE = {
        usernameOrEmailAddress: data.username,
        password: data.password,
        //userType: 1
      };
      return request({
        url: `${baseUrl}Account`,
        method: "post",
        data: newDataE,
      });
    },
    {
      onSuccess: (responseData) => AdminLoginHandle(responseData, router, i18Lang),
      onError: (responseData) => ToastNotification("error", responseData.error.message),
    }
  );
};

export default useHandleAdminLogin;
