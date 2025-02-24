import { useContext } from "react";
import { Col, Label } from "reactstrap";
import { Field } from "formik";
import { ReactstrapRadio } from "../../Components/ReactstrapFormik";
import { useTranslation } from "@/app/i18n/client";
import I18NextContext from "@/Helper/I18NextContext";

const ShowAddress = ({ item, type, index }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");

  return (
    <Col xxl={6} lg={12} md={6} style={{ marginTop: "15px" }}>
      <Label htmlFor={`address-${type}-${index}`} style={{ width: "100%" }}>
        <div className="delivery-address-box p-3">
          <div>
            <div className="form-check pt-2">
              <Field
                component={ReactstrapRadio}
                id={`address-${type}-${index}`}
                className="form-check-input"
                type="radio"
                name={`${type}_address`}
                value={item}
                index={index}
              />
            </div>
            <ul className="delivery-address-detail">
              <li>
                <h4 className="fw-semibold">{item?.title}</h4>
              </li>
              <li>
                <p
                  className="text-content"
                  style={{ color: "var(--theme-color)" }}
                >
                  <span className="text-title">{t("Address")} : </span>
                  {item?.address1} {item?.address2}, {item?.country?.name}
                </p>
              </li>
              {/* <li>
                <h6 className='text-content' style={{color: 'var(--theme-color)'}}>
                  <span className='text-title'>{t('PinCode')} :</span> {item?.postalCode}
                </h6>
              </li> */}
              {/* <li>
                <h6 className='text-content mb-0'>
                  <span className='text-title'>{t('Phone')} :</span> {item?.country_code && `+${item?.country_code}`} {item?.phone}
                </h6>
              </li> */}
            </ul>
          </div>
        </div>
      </Label>
    </Col>
  );
};

export default ShowAddress;
