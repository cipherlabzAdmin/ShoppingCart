import React, { useContext, useState, useEffect } from "react";
import Btn from "@/Elements/Buttons/Btn";
import ThemeOptionContext from "@/Helper/ThemeOptionsContext";
import HeaderDealModal from "./HeaderDealModal";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import { RiFlashlightLine } from "react-icons/ri";
import CustomModal from '../../../Components/Common/WarehouseModal';
import SelectWarehouse from "../RightSideHeader/SelectWarehouse";
import { MdOutlineWarehouse } from "react-icons/md";
import CustomerContext from "@/Helper/CustomerContext";

const WarehouseHeader = () => {
  const { themeOption } = useContext(ThemeOptionContext);
  const [modal, setModal] = useState(false);
  const { i18Lang } = useContext(I18NextContext);
   const { warehouseSelect, setWarehouseSelect } = useContext(CustomerContext);
  const { t } = useTranslation(i18Lang, "common");
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  useEffect(() => {
    const storedWarehouse = JSON.parse(localStorage.getItem('selectedWarehouse'));
    setSelectedWarehouse(storedWarehouse);
    setWarehouseSelect(false)
  }, [warehouseSelect]);
  
  const closeModal = () => {
    setModal(false);
  };
  

  return (
    <>
      {selectedWarehouse && (
        <>
          <div className="header-nav-right me-2">
            <Btn className="warehouse-btn" onClick={() => setModal(true)}>
            <MdOutlineWarehouse />
              <span>{t(selectedWarehouse.name)}</span>
            </Btn>
          </div>
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
              <SelectWarehouse closeModal={setModal} />
            </div>
          </CustomModal>
        </>
      )}
    </>
  );
};

export default WarehouseHeader;
