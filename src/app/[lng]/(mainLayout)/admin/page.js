"use client";
import { useContext, useEffect } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import { Col } from "reactstrap";
import WrapperComponent from "@/Components/Common/WrapperComponent";
import AuthHeadings from "@/Components/Auth/Common/AuthHeadings";
import loginImage from "../../../../../public/assets/images/inner-page/log-in.jpg";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import Breadcrumb from "@/Components/Common/Breadcrumb";
import { Form, Formik } from "formik";
import useHandleAdminLogin, {
  AdminLogInSchema,
} from "@/Utils/Hooks/Auth/useAdminLogin";
import { useRouter } from "next/navigation";
import SimpleInputField from "@/Components/Common/InputFields/SimpleInputField";
import FormBtn from "@/Components/Common/FormBtn";
import AuthContext from "@/Helper/AuthContext/AuthContext";
import { AuthProvider } from "@/Helper/AuthContext/AuthContext";

const LoginContent = () => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const { mutate, isLoading } = useHandleAdminLogin();
  const router = useRouter();
  const { login } = useContext(AuthContext);
  let { Auth } = '';
  
  const handleSubmit = (values) => {
    mutate(values, {
      onSuccess: () => {
        localStorage.setItem("userType", 1); 
        router.push("/admin/driver");
      },
    });
  };
  

  useEffect(() => {
    // Function to check if the user is logged in
    const checkIfLoggedIn = () => {
      Auth = Cookies.get("uatTemp");
      return !!Auth;
    };

    // Redirect to desired if the user is logged in
    if (checkIfLoggedIn()) {
      const currentUser = JSON.parse(Auth);
      
      if (currentUser.userType == 5) {
       // router.push(`/${i18Lang}/admin/route`);
      } else {
       // router.push(`/${i18Lang}/admin/driver`);
      }
    }
  }, [router, i18Lang]);

  return (
    <>
      <Breadcrumb title={"Admin Login"} subNavigation={[{ name: "Login" }]} />
      <WrapperComponent
        classes={{
          sectionClass: "log-in-section background-image-2 section-b-space",
          fluidClass: "w-100",
        }}
        customCol={true}
      >
        <Col xxl={6} xl={5} lg={6} className="d-lg-block d-none ms-auto">
          <div className="image-contain">
            <Image
              src={loginImage}
              className="img-fluid"
              alt="loginImage"
              height={465}
              width={550}
            />
          </div>
        </Col>

        <Col xxl={4} xl={5} lg={6} sm={8} className="mx-auto">
          <div className="log-in-box">
            <AuthHeadings
              heading1={"Welcome To Adminstrator"}
              heading2={"LogInYourAccount"}
            />

            <div className="input-box">
              <Formik
                initialValues={{
                  username: "",
                  password: "",
                  userType: 1,
                }}
                validationSchema={AdminLogInSchema}
                //onSubmit={mutate}
                onSubmit={handleSubmit}
              // onSubmit={router.push(`/${i18Lang}/auth/otp-verification`)}
              >
                {() => (
                  <>
                    <Form className="row g-4">
                      <SimpleInputField
                        nameList={[
                          {
                            name: "username",
                            placeholder: t("Enter username"),
                            title: "Username or Email",
                            label: "Username or Email",
                          },
                          {
                            name: "password",
                            placeholder: t("Enter Password"),
                            type: "password",
                            title: "Password",
                            label: "Password",
                          },
                        ]}
                      />
                      <FormBtn
                        title={"LogIn"}
                        classes={{ btnClass: "btn btn-animation w-100" }}
                        loading={isLoading}

                      />
                    </Form>
                  </>
                )}
              </Formik>
            </div>

            <div className="other-log-in">
              <h6>{t("or")}</h6>
            </div>

            <div className="sign-up-box">
              {t("Contact System Adminstrator")}
            </div>
          </div>
        </Col>
      </WrapperComponent>
    </>
  );
};

// const ProtectedLoginContent = withAuth(LoginContent);

const AdminPage = () => {
  return (
    <AuthProvider>
      <LoginContent />
    </AuthProvider>
  );
};

export default AdminPage;
