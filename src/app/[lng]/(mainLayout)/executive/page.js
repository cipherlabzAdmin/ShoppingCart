"use client";

import { useContext, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import { Col, Modal, ModalBody, Input } from "reactstrap";
import { useRouter } from "next/navigation";
import { Form, Formik } from "formik";
import WrapperComponent from "@/Components/Common/WrapperComponent";
import AuthHeadings from "@/Components/Auth/Common/AuthHeadings";
import Breadcrumb from "@/Components/Common/Breadcrumb";
import SimpleInputField from "@/Components/Common/InputFields/SimpleInputField";
import FormBtn from "@/Components/Common/FormBtn";

import I18NextContext from "@/Helper/I18NextContext";
import AuthContext, { AuthProvider } from "@/Helper/AuthContext/AuthContext";
import { AdminLogInSchema } from "@/Utils/Hooks/Auth/useAdminLogin";

import loginImage from "../../../../../public/assets/images/inner-page/log-in.jpg";
import { useTranslation } from "@/app/i18n/client";
import getCustomersByExecutiveUserId from "@/app/api/admin/ecommerce/getCustomersByExecutiveUserId";
import { toast } from "react-toastify";
import AccountContext from "@/Helper/AccountContext";

const ExecutiveLoginContent = () => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [executiveId, setExecutiveID] = useState(null);
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const baseUrl = process?.env?.API_BASE_URL;
  // const { setAccountData } = useContext(AccountContext);


  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}services/app/account/GetUserIdByLoginInfo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      setExecutiveID(data.result);
      localStorage.setItem("ExeID" ,data.result);
      fetchCustomers(data.result);
    } catch (error) {
      console.error("Login Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomers = async (user) => {
    if (!user) {
      toast.error("Access denied. Please log in with executive credentials.");
      return;
    }
    try {
      const response = await getCustomersByExecutiveUserId(user);
      await setOptions(response.result);
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch IOU balance:", error);
    }
  };

  const handleSelect = (option) => {
    setSelectedItem(option);
    setModalOpen(false);
    Cookies.remove("uatTemp");
    Cookies.remove("cusTemp");
    Cookies.set("uat", JSON.stringify(option), {
      path: "/",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    Cookies.set("uatTemp", JSON.stringify(option), {
      path: "/",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    localStorage.setItem("userType", 3);
    router.push("/theme/paris");
  };

  return (
    <>
      <Breadcrumb title={"Manager Login"} subNavigation={[{ name: "Login" }]} />
      <WrapperComponent
        classes={{
          sectionClass: "log-in-section background-image-2 section-b-space",
          fluidClass: "w-100",
        }}
        customCol
      >
        <Col xxl={6} xl={5} lg={6} className="d-lg-block d-none ms-auto">
          <div className="image-contain">
            <Image
              src={loginImage}
              className="img-fluid"
              alt="Login"
              height={465}
              width={550}
            />
          </div>
        </Col>

        <Col xxl={4} xl={5} lg={6} sm={8} className="mx-auto">
          <div className="log-in-box">
            <AuthHeadings heading1={"Welcome"} heading2={"LogInYourAccount"} />
            <div className="input-box">
              <Formik
                initialValues={{ username: "", password: "" }}
                validationSchema={AdminLogInSchema}
                onSubmit={handleSubmit}
              >
                {() => (
                  <Form className="row g-4">
                    <SimpleInputField
                      nameList={[
                        {
                          name: "username",
                          placeholder: t("Enter username"),
                          title: "Username",
                          label: "Username",
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
                )}
              </Formik>
            </div>
          </div>
        </Col>
      </WrapperComponent>

      <Modal isOpen={modalOpen} backdrop="static">
        <ModalBody>
          <h4 className="my-3 fw-bold">Select Customer</h4>
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            <ul className="list-group">
              {options.filter((option) =>
                `${option.firstName} ${option.lastName}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ).length === 0 ? (
                <li className="list-group-item">No options found</li>
              ) : (
                options
                  .filter((option) =>
                    `${option.firstName} ${option.lastName}`
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((option) => (
                    <li
                      key={option.id} // Use a unique key
                      onClick={() => handleSelect(option)}
                      className="list-group-item list-group-item-action"
                      style={{ cursor: "pointer" }}
                    >
                      {option.firstName} {option.lastName}
                    </li>
                  ))
              )}
            </ul>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

const ExecutiveLoginPage = () => (
  <AuthProvider>
    <ExecutiveLoginContent />
  </AuthProvider>
);

export default ExecutiveLoginPage;
