"use client";

import Breadcrumb from "@/Components/Common/Breadcrumb";
import WrapperComponent from "@/Components/Common/WrapperComponent";
import Image from "next/image";
import { Col } from "reactstrap";
import forgotPasswordImage from "../../../../public/assets/images/inner-page/forgot.png";
import OTPVerificationForm from "./OTPVerificationForm";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
const baseUrl = process?.env?.API_BASE_URL;
import { Button } from "reactstrap";
import Cookies from "js-cookie";
import { ToastNotification } from "../../../Utils/CustomFunctions/ToastNotification";

const OTPVerificationContent = () => {
  const [token, setToken] = useState(true);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState(60);
  const [customer, setCustomer] = useState();
  const [customerTp, setCustomerTp] = useState();

  const isAuthString = Cookies.get("uatTemp");
  const isAuth = isAuthString ? JSON.parse(isAuthString) : null;

  const isAuthCusString = Cookies.get("cusTemp");
  const isAuthCus = isAuthCusString ? JSON.parse(isAuthCusString) : null;

  useEffect(() => {
    if (isAuth) {
      setCustomer(isAuth);
      const ctp = isAuth.mobileNo;
      setCustomerTp(ctp.substring(ctp.length - 9));
    }
    else if(isAuthCus){
      setCustomer(isAuthCus);
      const ctp = isAuthCus.mobileNo;
      setCustomerTp(ctp.substring(ctp.length - 9));
    }
  }, []);


  const searchParams = useSearchParams();
  let tp = searchParams.get("tp");


  async function sendOtp() {
    try {
      const response = await fetch(
        `${baseUrl}services/common/sms/SendSms?customerId=${customer.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify([tp ? tp : customerTp]),
        }
      );

      const Data = await response.json();
      if (Data.result.isSuccess) {
        ToastNotification("success", "Sent OTP Successfully!");
      } else {
        ToastNotification("error", "OTP sending fail. Please try again!");
      }
    } catch (error) {
      console.log("Error sending OTP:", error);
    }
  }

  useEffect(() => {
    if (customer) {
      sendOtp();
      setIsResendDisabled(true);

      let seconds = 30;
      const intervalId = setInterval(() => {
        setRemainingSeconds((prevSeconds) => {
          if (prevSeconds === 1) {
            setIsResendDisabled(false);
            clearInterval(intervalId);
            return 60; // Reset seconds when reaching 0
          }
          return prevSeconds - 1;
        });
      }, 1000);

      return () => clearInterval(intervalId); // Clear the interval when the component unmounts or when the token changes
    }
  }, [customer, token]);
  return (
    <>
      <Breadcrumb
        title={"OTPVerification"}
        subNavigation={[{ name: "OTPVerification" }]}
      />
      <WrapperComponent
        classes={{
          sectionClass: "log-in-section section-b-space forgot-section",
          fluidClass: "w-100",
        }}
        customCol={true}
      >
        <Col xxl={6} xl={5} lg={6} className="d-lg-block d-none ms-auto">
          <div className="image-contain">
            <Image
              src={forgotPasswordImage}
              className="img-fluid"
              alt="OTPVerification"
            />
          </div>
        </Col>

        <Col xxl={4} xl={5} lg={6} sm={8} className="mx-auto">
          <div className="d-flex align-items-center justify-content-center h-100">
            <div className="log-in-box">
              <div className="input-box">
                {isResendDisabled ? (
                  <p
                    className="mb-4 text-theme fw-bold"
                    style={{ fontSize: "16px" }}
                  >
                    You can resend otp after {remainingSeconds} seconds
                  </p>
                ) : (
                  <Button
                    className="p-0 mb-4 text-theme"
                    disabled={isResendDisabled}
                    color="link"
                    onClick={() => setToken(!token)}
                  >
                    Resend OTP
                  </Button>
                )}

                <OTPVerificationForm />
              </div>
            </div>
          </div>
        </Col>
      </WrapperComponent>
    </>
  );
};

export default OTPVerificationContent;
