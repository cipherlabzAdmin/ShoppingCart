import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Col, Row, Table } from "reactstrap";
import dashProfileImage from "../../../../public/assets/images/inner-page/dashboard-profile.png";
import EmailPassword from "./EmailPassword";
import Cookies from "js-cookie";

const baseUrl = process?.env?.API_BASE_URL;

const ProfileInformation = () => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");

  const isAuthString = Cookies.get("uatTemp");
  const isAuth = isAuthString ? JSON.parse(isAuthString) : null;

  const isAuthCusString = Cookies.get("cusTemp");
  const isAuthCus = isAuthCusString ? JSON.parse(isAuthCusString) : null;

  const [address, setAddress] = useState([]);

  useEffect(() => {
    async function fetchCheckoutAddress() {
      try {
        const response = await fetch(`${baseUrl}services/ecommerce/checkoutAddress/GetAll`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              checkoutId: null,
              eCommerceCustomerId: isAuth?.id,
            }),
          }
        );

        const data = await response.json();
        setAddress(data?.result || []);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    }

    if (isAuth?.id) {
      fetchCheckoutAddress();
    }
  }, []);

  return (
    <div className="profile-about dashboard-bg-box">
      <Row>
        <Col xxl={7}>
          <div className="dashboard-title mb-3">
            <h3>{t("ProfileInformation")}</h3>
          </div>

          <div className="table-responsive">
            <Table>
              <tbody>
                <tr>
                  <td>{t("Name")} :</td>
                  <td>
                    {isAuth
                      ? isAuth.firstName
                      : isAuthCus
                      ? isAuthCus.firstName
                      : ""}{" "}
                    {isAuth
                      ? isAuth.lastName
                      : isAuthCus
                      ? isAuthCus.lastName
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td>{t("PhoneNumber")} :</td>
                  <td>
                    +
                    {isAuth
                      ? isAuth.mobileNo
                      : isAuthCus
                      ? isAuthCus.mobileNo
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td>{t("Address")} :</td>
                  <td>
                    {address?.items ? address?.items[0]?.stree : ""}
                    {address?.items ? address?.items[0]?.address1 : ""},{" "}
                    {address?.items ? address?.items[0]?.address2 : ""}{" "}
                    {address?.items ? address?.items[0]?.postalCode : ""}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div className="dashboard-title mb-3">
            <h3>{t("LoginDetails")}</h3>
          </div>
          <EmailPassword />
        </Col>
        <Col xxl={5}>
          <div className="profile-image">
            <Image
              src={dashProfileImage}
              className="img-fluid"
              alt="profile-image"
              height={450}
              width={450}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileInformation;