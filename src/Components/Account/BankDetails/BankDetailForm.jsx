import { useContext, useEffect } from "react";
import { Form, Formik } from "formik";
import SimpleInputField from "@/Components/Common/InputFields/SimpleInputField";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import Btn from "@/Elements/Buttons/Btn";
import { PaymentAccountAPI } from "@/Utils/AxiosUtils/API";
import request from "@/Utils/AxiosUtils";
import { useQuery } from "@tanstack/react-query";
import AccountHeading from "@/Components/Common/AccountHeading";
import Loader from "@/Layout/Loader";

const BankDetailForm = () => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const {
    data,
    refetch,
    isLoading: paymentLoader,
  } = useQuery([PaymentAccountAPI], () => request({ url: PaymentAccountAPI }), {
    enabled: false,
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
  });
  useEffect(() => {
    refetch();
  }, []);
  if (paymentLoader) return <Loader />;
  return (
    <>
      <Formik
        initialValues={{
          bank_account_no: data ? data?.bank_account_no : "",
          bank_holder_name: data ? data?.bank_holder_name : "",
          bank_name: data ? data?.bank_name : "",
          paypal_email: data ? data?.paypal_email : "",
          swift: data ? data?.swift : "",
          ifsc: data ? data?.ifsc : "",
        }}
        onSubmit={(values) => {
          // Add Account Details Here
        }}
      >
        <Form className="themeform-auth">
          <AccountHeading title="BankDetails" />
          <SimpleInputField
            nameList={[
              {
                name: "bank_account_no",
                placeholder: t("EnterBankAccountNo"),
                type: "number",
                title: "BankAccountNo",
              },
              {
                name: "bank_name",
                placeholder: t("EnterBankName"),
                title: "BankName",
              },
              {
                name: "bank_holder_name",
                placeholder: t("EnterHolderName"),
                title: "HolderName",
              },
              { name: "swift", placeholder: t("EnterSwift"), title: "Swift" },
              { name: "ifsc", placeholder: t("EnterIFSC"), title: "IFSC" },
            ]}
          />
          <AccountHeading title="PayPalDetails" />
          <SimpleInputField
            nameList={[
              {
                name: "paypal_email",
                type: "email",
                placeholder: t("EnterPaypalEmail"),
                title: "PaypalEmail",
              },
            ]}
          />
          <div className="text-end">
            <Btn
              className="theme-bg-color btn-md d-inline-block text-light"
              title="Save"
            ></Btn>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default BankDetailForm;
