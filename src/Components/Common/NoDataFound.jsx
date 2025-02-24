import { useContext } from "react";
import Image from "next/image";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import Btn from "@/Elements/Buttons/Btn";
import { RiArrowLeftLine } from "react-icons/ri";

const NoDataFound = ({ data = {} }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  return (
    <div className={data?.customClass ? data?.customClass : ""}>
      {data?.imageUrl && (
        <Image
          src={data?.imageUrl}
          className="img-fluid"
          alt="no-data"
          height={data?.height}
          width={data?.width}
        />
      )}
      <h4>{t(data?.title)}</h4>
      <p>{t(data?.description)}</p>
      <div className="d-flex mt-2 justify-content-center">
      <Btn  onClick={() => (window.location.href = './theme/paris')} className="btn bg-danger text-light">
        <RiArrowLeftLine /> {t("ReturnToShopping")}
      </Btn>
      </div>
    </div>
  );
};

export default NoDataFound;
