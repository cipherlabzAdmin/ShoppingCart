import { Form, Formik } from "formik";
import Link from "next/link";
import { Col, Input, Label } from "reactstrap";
import {  } from "reactstrap";
import FormBtn from "@/Components/Common/FormBtn";
import SimpleInputField from "@/Components/Common/InputFields/SimpleInputField";
import RadioField from "@/Components/Common/InputFields/RadioField";
import useHandleLogin, { LogInSchema, LogInSchemaTp} from "@/Utils/Hooks/Auth/useLogin";
import { useContext } from "react";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import React, { useState } from "react";
import Btn from "@/Elements/Buttons/Btn";
import { AllCountryCode } from "../../../../Data/AllCountryCode";
import SearchableSelectInput from "@/Components/Common/InputFields/SearchableSelectInput";
import { useRouter } from 'next/navigation';

const LoginForm = (rSelected) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const { mutate, isLoading } = useHandleLogin(rSelected);
  const router = useRouter();

  return (
    <Formik
      initialValues= {{
        emailAddress: "",
        password: "",
        country_code: "94",
        phone: "",
      }}
      validationSchema={rSelected.rSelected == 1 ? LogInSchema : LogInSchemaTp}
      onSubmit={mutate}
      // onSubmit={router.push(`/${i18Lang}/auth/otp-verification`)}
    >
      {() => (
         <>
        <Form className="row g-4">


            {rSelected.rSelected == 1 ? (<SimpleInputField
              nameList={[
                {
                  name: "emailAddress",
                  placeholder: t("EmailAddress"),
                  title: "Email",
                  label: "Email Address",
                },
                {
                  name: "password",
                  placeholder: t("EnterPassword"),
                  type: "password",
                  title: "Password",
                  label: "Password",
                },
              ]} />) :
              (

                <><Col xs="12">
                  <div className="country-input">
                    <SearchableSelectInput
                      nameList={[
                        {
                          name: "country_code",
                          notitle: "true",
                          inputprops: {
                            name: "country_code",
                            id: "country_code",
                            options: AllCountryCode,
                          },
                        },
                      ]} />
                    <SimpleInputField
                      nameList={[
                        {
                          name: "phone",
                          type: "number",
                          placeholder: t("EnterPhoneNumber"),
                          colclass: "country-input-box",
                          title: "Phone",
                          label: "Phone",
                        },
                      ]} />
                  </div>
                </Col>
                  <SimpleInputField
                    nameList={[
                      {
                        name: "password",
                        placeholder: t("EnterPassword"),
                        type: "password",
                        title: "Password",
                        label: "Password",
                      },
                    ]} /></>)}


            <Col xs={12}>
              <div className="forgot-box">
                <div className="form-check remember-box">
                  <Input
                    className="checkbox_animated check-box"
                    type="checkbox"
                    id="flexCheckDefault" />
                  <Label className="form-check-label" htmlFor="flexCheckDefault">
                    {t("Rememberme")}
                  </Label>
                </div>
                <Link
                  href={`/${i18Lang}/auth/forgot-password`}
                  className="forgot-password"
                >
                  {t("ForgotPassword")}?
                </Link>
              </div>
            </Col>
            <FormBtn
              title={"LogIn"}
              classes={{ btnClass: "btn btn-animation w-100" }}
              loading={isLoading} />
          </Form></>
      )}
    </Formik>
  );
};

export default LoginForm;
