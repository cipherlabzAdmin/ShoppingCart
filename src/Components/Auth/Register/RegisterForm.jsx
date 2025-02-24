import { useContext } from "react";
import { Form, Formik } from "formik";
import { Col, Input, Label } from "reactstrap";
import { useTranslation } from "@/app/i18n/client";
import I18NextContext from "@/Helper/I18NextContext";
import {
  YupObject,
  emailSchema,
  nameSchema,
  passwordConfirmationSchema,
  passwordSchema,
  phoneSchema,
} from "@/Utils/Validation/ValidationSchemas";
import FormBtn from "@/Components/Common/FormBtn";
import SimpleInputField from "@/Components/Common/InputFields/SimpleInputField";
import { AllCountryCode } from "../../../../Data/AllCountryCode";
import SearchableSelectInput from "@/Components/Common/InputFields/SearchableSelectInput";
import { useRouter } from "next/navigation";
import { ToastNotification } from "../../../Utils/CustomFunctions/ToastNotification";
const baseUrl = process?.env?.API_BASE_URL;

const RegisterForm = () => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const router = useRouter();

async function Register(data) {
    try {
      const response = await fetch(`${baseUrl}services/ecommerce/eCommerceCustomer/Create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers if needed
        },
        body: data,
      });
  
      const result = await response.json();
      if(result.success){
        ToastNotification("success", "Registered Successfully");
       router.push(`/${i18Lang}/auth/login`);
      }else if(response.status === 500){
        ToastNotification("error", result.error.message);
      }
    

    } catch (error) {
      console.log(error);
      ToastNotification("error", error.message);
    }
  }

  return (
    <Formik
      initialValues={{
        name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        country_code: "94",
        phone: "",
      }}
      validationSchema={YupObject({
        name: nameSchema,
        last_name: nameSchema,
        email: emailSchema,
        password: passwordSchema,
        password_confirmation: passwordConfirmationSchema,
        phone: phoneSchema,
      })}
      onSubmit={(values) => {
        
       const data = JSON.stringify({
        "email": values.email,
        "firstName": values.name,
        "lastName": values.last_name,
        "mobileNo": values.country_code + values.phone,
        "password": values.password
        })
        Register(data);
      }}
    >
      {({ values }) => (
        <Form className="row g-md-4 g-3">
          <Col xs="6">
            <SimpleInputField
              nameList={[
                {
                  name: "name",
                  placeholder: t("FirstName"),
                  title: "Name",
                  label: "FirstName",
                },
              ]}
            />
          </Col>
          <Col xs="6">
            <SimpleInputField
              nameList={[
                {
                  name: "last_name",
                  placeholder: t("LastName"),
                  title: "LastName",
                  label: "LastName",
                },
              ]}
            />
          </Col>
          
          <Col xs="12">
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
                  ]}
                />
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
                  ]}
                />
              </div>
            </Col>
          <SimpleInputField
            nameList={[
              
              {
                name: "email",
                placeholder: t("EmailAddress"),
                title: "Email",
                label: "EmailAddress",
              },

              {
                name: "password",
                placeholder: t("Password"),
                type: "password",
                title: "Password",
                label: "Password",
              },
              {
                name: "password_confirmation",
                type: "password",
                placeholder: t("ConfirmPassword"),
                title: "ConfirmPassword",
                label: "ConfirmPassword",
              },
            ]}
          />

     

          <Col xs={12}>
            <div className="forgot-box">
              <div className="form-check remember-box">
                <Input
                  className="checkbox_animated check-box"
                  type="checkbox"
                  id="flexCheckDefault"
                />
                <Label className="form-check-label" htmlFor="flexCheckDefault">
                  {t("Iagreewith")}
                  <span>{t("Terms")}</span> {t("and")}{" "}
                  <span>{t("Privacy")}</span>
                </Label>
              </div>
            </div>
          </Col>
          <FormBtn
            title={"SignUp"}
            classes={{ btnClass: "btn btn-animation w-100" }}
          />
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
