import { useContext } from "react";
import { RiQuestionLine } from "react-icons/ri";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import Btn from "@/Elements/Buttons/Btn";
import CustomModal from "./CustomModal";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const ConfirmationModal = ({ modal, setModal, isLoading, confirmFunction }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const router = useRouter();
  const userType = localStorage.getItem("userType");

  const handleConfirm = () => {
    if (confirmFunction) confirmFunction();
    Cookies.remove("uat", { path: "/" });
    Cookies.remove("uatTemp", { path: "/" });
    localStorage.setItem("userType", 2);

    router.push(
      `/${i18Lang}/${
        userType === "1"
          ? "admin"
          : userType === "3"
          ? "executive"
          : "theme/paris"
      }`
    );
  };

  return (
    <CustomModal
      modal={modal}
      setModal={setModal}
      classes={{
        modalClass: "theme-modal delete-modal",
        modalHeaderClass: "p-0",
      }}
    >
      <RiQuestionLine className="icon-box wo-bg" />
      <h5 className="modal-title">{t("Confirmation")}</h5>
      <p>{t("AreYouSure")} </p>
      <div className="button-box">
        <Btn
          title="No"
          className="btn btn-md btn-theme-outline fw-bold"
          onClick={() => setModal("")}
        />
        <Btn
          title="Yes"
          className="theme-bg-color btn-md fw-bold text-light"
          loading={Number(isLoading)}
          //onClick={confirmFunction}
          onClick={handleConfirm}
        />
      </div>
    </CustomModal>
  );
};

export default ConfirmationModal;
