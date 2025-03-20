import React, { useContext, useState, useEffect } from "react";
import { RiSearchLine } from "react-icons/ri";
import ResponsiveSearch from "../Common/ResponsiveSearch";
import HeaderWishList from "./HeaderWishList";
import HeaderCart from "./HeaderCart";
import HeaderWhatsApp from "./HeaderWhatsApp";
import HeaderMessanger from "./HeaderMessanger";
import HeaderProfile from "./HeaderProfile";
import { useRouter } from "next/navigation";
import I18NextContext from "@/Helper/I18NextContext";
import ThemeOptionContext from "@/Helper/ThemeOptionsContext";
import CustomModal from "../../../Components/Common/WarehouseModal";
import { RiQuestionLine } from "react-icons/ri";
import { useTranslation } from "@/app/i18n/client";
import SelectWarehouse from "./SelectWarehouse";

const RightSideHeader = ({ noContactUs, wishListIcon }) => {
  const router = useRouter();
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const { cartCanvas, setCartCanvas } = useContext(ThemeOptionContext);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [modal, setModal] = useState(selectedWarehouse ? false : true);

  const closeModal = () => {
    setModal(false);
  };

  useEffect(() => {
    const storedWarehouse = JSON.parse(
      localStorage.getItem("selectedWarehouse")
    );
    setSelectedWarehouse(storedWarehouse);
  }, []);

  return (
    <div className="rightside-box">
      <ResponsiveSearch />
      <ul className="right-side-menu">
        <li className="right-side">
          <div className="delivery-login-box">
            <div className="delivery-icon">
              <div
                className="search-box"
                onClick={() => router.push(`/${i18Lang}/search`)}
              >
                <RiSearchLine style={{ color: "var(--yellow)" }} />
              </div>
            </div>
          </div>
        </li>
        {/* {!noContactUs && <HeaderContactUs />}*/}
        {/* <Link href="https://api.whatsapp.com/send?phone=94710715460&text=Hello%20there!" target="_blank">
        <RiWhatsappFill color="#3caf41"/>
                </Link> */}
        <HeaderMessanger />
        <HeaderWhatsApp />
        <HeaderWishList wishListIcon={wishListIcon} />
        <HeaderCart />
        <HeaderProfile />
      </ul>
      <div
        className={`bg-overlay  ${cartCanvas ? "show" : ""}`}
        onClick={() => setCartCanvas((prev) => !prev)}
      />
      {!selectedWarehouse && (
        <CustomModal
          modal={modal}
          setModal={setModal}
          classes={{
            modalClass: "theme-modal delete-modal",
            modalHeaderClass: "p-0",
          }}
        >
          <h5 className="modal-title">{t("Go to Nearest Outlet")}</h5>
          <p>{t("Please Select an Outlet")} </p>
          <div className="button-box">
            <SelectWarehouse closeModal={closeModal} />
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default RightSideHeader;
