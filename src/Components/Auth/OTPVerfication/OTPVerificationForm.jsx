import { useContext, useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { Input } from "reactstrap";
import Cookies from "js-cookie";
import I18NextContext from "@/Helper/I18NextContext";
import { ForgotPasswordSchema } from "@/Utils/Hooks/Auth/useForgotPassword";
import { useTranslation } from "@/app/i18n/client";
import useOtpVerification from "@/Utils/Hooks/Auth/useOtpVerification";
import Btn from "@/Elements/Buttons/Btn";

const OTPVerificationForm = () => {
  const cookies = Cookies.get("ue");
  const [otp, setOtp] = useState("");
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');
  const { mutate: otpVerification,isLoading } = useOtpVerification();
  const handleChange = (e) => {
    // if (e.target.value.length <= 6 && !isNaN(Number(e.target.value))) {
    //   setOtp(e.target.value);
    // }

    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    const limitedValue = numericValue.slice(0, 6);
    setOtp(limitedValue);
  };
  useEffect(() => {
    otp && otp.length === 6 && otpVerification({ email: cookies, token: otp });
  }, [otp]);


  return (
    <>
      <Formik>
        {() => (
          <Form className="row g-2">
            <div className="log-in-title">
              <h3 className="text-content" style={{color: 'var(--theme-color)'}}>{t("OtpDescription")}</h3>
              <h5 className="text-content" style={{color: 'var(--theme-color)'}}>{t("CodeSend") + " "}</h5>
            </div>
            <div className='outer-otp'>
              <div className='inner-otp'>
                <Input type='text' className='no-background' maxLength='6' onChange={handleChange} value={otp} />
              </div>
            </div>
            <Btn title={'Validate'} loading={isLoading} type='button' className="btn-animation mt-3 w-100"/>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default OTPVerificationForm;
