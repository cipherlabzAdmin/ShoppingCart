import { useContext } from "react";
import { Formik } from "formik";
import I18NextContext from "@/Helper/I18NextContext";
import AuthHeadings from "../Common/AuthHeadings";
import { useTranslation } from "@/app/i18n/client";
import SelectForm from "./SelectForm";
import { useRouter } from "next/navigation";

const baseUrl = process?.env?.API_BASE_URL;
import Cookies from "js-cookie";

const NicSearch = ({ modal, setModal }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const router = useRouter();

  async function SearchNic(data) {
    try {
      const response = await fetch(
        `${baseUrl}services/ecommerce/eCommerceCustomer/SearchCustomerByNIC`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (result.success) {
        Cookies.set("cusTemp", JSON.stringify(result.result.data), {
          path: "/",
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
        // localStorage.setItem('customerDetails', JSON.stringify(result.result.data));
        router.push(`/${i18Lang}/auth/otp-verification`);
        setModal(false);
        // router.push(`/${i18Lang}/theme/paris`);
        // ToastNotification("success", `Customer ${result.result.data.firstName} Selected Successfully!`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <AuthHeadings heading1={"Client NIC"} />
      <Formik
        initialValues={{
          NIC: "",
        }}
        //   validationSchema={YupObject({
        //     NIC: nameSchema,
        //   })}
        onSubmit={(values) => {
          const data = {
            nic: values.NIC,
          };
          SearchNic(data);
        }}
      >
        {({ values, setFieldValue }) => (
          <SelectForm
            values={values}
            setFieldValue={setFieldValue}
            setModal={setModal}
          />
        )}
      </Formik>
    </>
  );
};

export default NicSearch;
