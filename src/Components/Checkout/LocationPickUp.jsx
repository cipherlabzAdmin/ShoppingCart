import { useContext, useEffect, useState } from "react";
import { Form } from "formik";
import { ModalFooter, Row } from "reactstrap";
import { RiAddLine, RiMapPinLine } from "react-icons/ri";
import { useTranslation } from "@/app/i18n/client";
import CheckoutCard from "./common/CheckoutCard";
import CustomModal from "../Common/CustomModal";
import AddAddressForm from "./common/AddAddressForm";
import I18NextContext from "@/Helper/I18NextContext";
import MapComponent from "../Map/Map";

const LocationPickUp = ({ modal, setModal,type }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const [modalOpen, setModalOpen] = useState(false);


  return (
    <>
      {/* <CheckoutCard icon={<RiMapPinLine />}> */}
        {/* <div className='checkout-title'>
          <h4>
            {t('Pick Delivery Location')}
          </h4>
        </div> */}
        <div className='checkout-detail mt-4' style={{cursor:'pointer'}}>
        <div className='delivery-address-box'  onClick={() => setModalOpen(true)}>
        <h4>
            {t('Enter location')}
          </h4>
          </div>
          <CustomModal
            modal={modalOpen}
            setModal={setModalOpen}
            classes={{
              modalClass: "theme-modal view-modal modal-md",
              modalHeaderClass: "p-0",
            }}
          >
            <>
              <MapComponent type={type} setModal={setModalOpen}/>
            </>
          </CustomModal>
        </div>
      {/* </CheckoutCard> */}
    </>
  );
};

export default LocationPickUp;
