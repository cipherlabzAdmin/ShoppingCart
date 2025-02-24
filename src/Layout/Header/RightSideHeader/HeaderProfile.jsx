import React, { useContext, useState } from "react";
import Link from "next/link";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";
import { RiLogoutBoxRLine, RiUserLine, RiLoginBoxLine } from "react-icons/ri";
import { LogoutAPI } from "@/Utils/AxiosUtils/API";
import useCreate from "@/Utils/Hooks/useCreate";
import ConfirmationModal from "@/Components/Common/ConfirmationModal";
import AccountContext from "@/Helper/AccountContext";
import Cookies from "js-cookie";
import { ToastNotification } from "../../../Utils/CustomFunctions/ToastNotification";
import { FaUserCircle } from "react-icons/fa";

const HeaderProfile = () => {
  const { i18Lang } = useContext(I18NextContext);
  const { accountData } = useContext(AccountContext);
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const { t } = useTranslation(i18Lang, "common");

  const { mutate, isLoading } = useCreate(
    LogoutAPI,
    false,
    false,
    "Logout Successfully",
    () => {
      router.push(`/${i18Lang}/theme/paris`);
      setModal(false);
    }
  );
  const isAuth = Cookies.get("uat");

  const isAuthData = isAuth ? JSON.parse(isAuth) : null;

  const userType = localStorage.getItem("userType");


  const handleLogout = async () => {
    Cookies.remove("uat", { path: "/" });
    ToastNotification("success", "Logout Successfully");
    localStorage.setItem("userType",2);

    try {
      await router.push(`/${i18Lang}/theme/paris`);
      //window.location.reload();
    } catch (error) {
      console.error("Navigation error:", error);
    }

    setModal(false);
  };

  const handleLogin = () => {
    router.push(`/${i18Lang}/auth/login`);
    setModal(false);
  };
  return (
    <li className="right-side onhover-dropdown">
      <div className="delivery-login-box">
        <div className="delivery-icon me-1">
          {accountData?.profile_image?.original_url ? (
            <FaUserCircle style={{ color: "var(--yellow)" }} />
          ) : (
            <h3>{accountData?.name?.charAt(0)?.toString()?.toUpperCase()}</h3>
          )}
        </div>
        <div className="delivery-detail">
          <h6 style={{ color: "var(--yellow)" }}>
            {t("Hi")},{" "}
            {isAuthData
              ? isAuthData.firstName
              : Number(userType) === 2
              ? ""
              : "Admin"}
          </h6>

          <h5 style={{ color: "white" }}>
            {Number(userType) === 2 ?  "My Account" :"Login as Internal User"}
          </h5>
        </div>
      </div>

      <div className="onhover-div onhover-div-login">
        <ul className="user-box-name">
          <li className="product-box-contain">
            <Link
              href={
                isAuth
                  ? `/${i18Lang}/account/dashboard`
                  : `/${i18Lang}/auth/login`
              }
            >
              <RiUserLine className="me-2" /> {t("MyAccount")}
            </Link>
          </li>
          
          {/* <li
            className="product-box-contain"
            onClick={() => {
              isAuth ? setModal(true) : handleLogin();
            }}
          >
            <a>
              {isAuth ? (
                <RiLogoutBoxRLine className="me-2" />
              ) : (
                <RiLogoutBoxRLine className="me-2" />
              )}

              {isAuth ? `LogOut` : `Login`}
            </a>
          </li> */}
          {Number(userType) == 2 ? (
            <li
              className="product-box-contain"
              onClick={() => {
                isAuth ? setModal(true) : handleLogin();
              }}
            >
              <a>
                {isAuth ? (
                  <RiLogoutBoxRLine className="me-2" />
                ) : (
                  <RiLogoutBoxRLine className="me-2" />
                )}

                {isAuth ? `LogOut` : `Login`}
              </a>
            </li>
          ) : (
            <li
              className="product-box-contain"
              onClick={() => {
                setModal(true);
              }}
            >
              <a>
                <RiLogoutBoxRLine className="me-2" />
                Logout
              </a>
            </li>
          )}

          <ConfirmationModal
            modal={modal}
            setModal={setModal}
            confirmFunction={handleLogout}
            isLoading={isLoading}
          />
        </ul>
      </div>
    </li>
  );
};

export default HeaderProfile;
