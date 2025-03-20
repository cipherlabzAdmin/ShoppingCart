import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RiLogoutBoxRLine, RiUserLine } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import Cookies from "js-cookie";
import I18NextContext from "@/Helper/I18NextContext";
import AccountContext from "@/Helper/AccountContext";
import { useTranslation } from "@/app/i18n/client";
import ConfirmationModal from "@/Components/Common/ConfirmationModal";
import { ToastNotification } from "@/Utils/CustomFunctions/ToastNotification";

const HeaderProfile = () => {
  const { i18Lang } = useContext(I18NextContext);
  const { accountData } = useContext(AccountContext);
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const { t } = useTranslation(i18Lang, "common");
  const userType = localStorage.getItem("userType");
  const isAuth = Cookies.get("uatTemp");
  const isAuthData = isAuth ? JSON.parse(isAuth) : null;

  const handleLogout = async () => {
    Cookies.remove("uat", { path: "/" });
    ToastNotification("success", "Logout Successfully");
    setModal(false);

    try {
      router.push(`/${i18Lang}/${userType === "1" ? "admin" : "theme/paris"}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleLogin = () => {
    router.push(`/${i18Lang}/auth/login`);
    setModal(false);
  };

  return (
    <li className="right-side onhover-dropdown">
      <div className="delivery-login-box">
        {isAuthData && isAuthData.firstName ?
        <div
          className="delivery-icon d-flex justify-content-center align-items-center border rounded-circle me-1"
          style={{ width: "30px", height: "30px" }}
        >
          <h3>{isAuthData && isAuthData.firstName?.charAt(0)?.toUpperCase()}</h3>
        </div>
: ""}
        <div className="delivery-detail">
          <h6 style={{ color: "var(--yellow)" }}>
            {t("Hi")},{" "}
            {isAuthData && isAuthData.firstName ? isAuthData.firstName : "User"}
          </h6>
          <h5 style={{ color: "white" }}>
            {userType && userType === "1" ? "Login as Internal User" : "My Account"}
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
          <li
            className="product-box-contain"
            onClick={() => (isAuth ? setModal(true) : handleLogin())}
          >
            <a>
              <RiLogoutBoxRLine className="me-2" />
              {isAuth ? "LogOut" : "Login"}
            </a>
          </li>
        </ul>
      </div>
      <ConfirmationModal
        modal={modal}
        setModal={setModal}
        confirmFunction={handleLogout}
      />
    </li>
  );
};

export default HeaderProfile;
