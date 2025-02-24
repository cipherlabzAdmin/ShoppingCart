import { useMutation } from '@tanstack/react-query';
import request from '../../AxiosUtils';
import { emailSchema, passwordSchema, YupObject } from '../../Validation/ValidationSchemas';
import { LoginAPI } from '../../AxiosUtils/API';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import I18NextContext from '@/Helper/I18NextContext';
import AccountContext from '@/Helper/AccountContext';
import CompareContext from '@/Helper/CompareContext';
import { ToastNotification } from "../../../Utils/CustomFunctions/ToastNotification";
const baseUrl = process?.env?.API_BASE_URL;
import Cookies from 'js-cookie';

export const LogInSchema = YupObject({
  emailAddress: emailSchema,
  password: passwordSchema,
});

const LoginHandle = (responseData, router, i18Lang, refetch, compareRefetch,callback) => {

  if (responseData.status === 200 || responseData.status === 201) {
   
    if(responseData.data?.result){
      Cookies.set('uat', "ManagerLogin", { path: '/', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
      Cookies.set('uatoken', responseData.data?.result, { path: '/', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        if (typeof callback === 'function') {
            callback();
          }

      refetch();
    }else{
        
      ToastNotification("error", responseData.response.data.error.details);
    }
  }else{
    ToastNotification("error", responseData.response.data.error.details);
  }
};

const useHandleManagerLogin = (callback) => {
  const { i18Lang } = useContext(I18NextContext);
  const { refetch } = useContext(AccountContext);
  const { refetch: compareRefetch } = useContext(CompareContext);

  const router = useRouter();
  return useMutation(
    (data) =>
      request({
        url: `${baseUrl}Account`,
        method: 'post',
        data,
      }),
    {
      onSuccess: (responseData) => LoginHandle(responseData, router, i18Lang, refetch, compareRefetch,callback),
     
      onError: (responseData) =>  ToastNotification("error", responseData.error.message)
    },
  );
};

export default useHandleManagerLogin;
